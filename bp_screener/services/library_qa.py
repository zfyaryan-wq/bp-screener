from __future__ import annotations

import json
import re
import hashlib
import sqlite3
from typing import Any

from bp_screener.config import LLM_MAX_TOKENS, RAG_QA_CACHE_ENABLED
from bp_screener.db import get_library_qa_cache, save_library_qa_cache
from bp_screener.llm_client import chat_completion
from bp_screener.search import hybrid_search_chunks, list_projects


SYSTEM_PROMPT = """You are a BP knowledge-base assistant for a small student investment review team.
Answer only from the retrieved BP evidence. Do not invent facts.
Compare projects when useful. If evidence is weak or missing, say so.
Always cite source file names and pages when making concrete claims.
Use Chinese if the user asks in Chinese; use English if the user asks in English."""


def answer_library_question(
    conn: sqlite3.Connection,
    question: str,
    lang: str = "zh",
    limit: int = 12,
) -> dict[str, Any]:
    cache_key = qa_cache_key(question, lang, limit)
    if RAG_QA_CACHE_ENABLED:
        cached = get_library_qa_cache(conn, cache_key)
        if cached:
            return cached

    evidence = build_library_evidence(conn, question, limit=limit)
    if not evidence:
        result = {
            "answer": (
                "No matching BP evidence was found. Try a broader question or analyze more BP files first."
                if lang == "en"
                else "没有找到匹配的 BP 证据。可以换一个更宽泛的问题，或先导入并分析更多 BP。"
            ),
            "sources": [],
            "used_fallback": True,
        }
        if RAG_QA_CACHE_ENABLED:
            save_library_qa_cache(conn, cache_key, lang, question, result)
        return result
    language_hint = "Answer in Chinese." if lang == "zh" else "Answer in English."
    try:
        response = chat_completion(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"{language_hint}\n\n"
                        "Question:\n"
                        f"{question}\n\n"
                        "Retrieved BP evidence JSON:\n"
                        f"{json.dumps(evidence, ensure_ascii=False)}\n\n"
                        "Write a concise, evidence-grounded answer. Include citations like "
                        "[source 1: file, p.3] for concrete claims."
                    ),
                },
            ],
            temperature=0.15,
            max_tokens=min(LLM_MAX_TOKENS, 2500),
        )
        result = {
            "answer": response.choices[0].message.content or "",
            "sources": evidence,
            "used_fallback": False,
        }
        if RAG_QA_CACHE_ENABLED:
            save_library_qa_cache(conn, cache_key, lang, question, result)
        return result
    except Exception as exc:
        result = {
            "answer": fallback_answer(question, evidence, lang, error=str(exc)),
            "sources": evidence,
            "used_fallback": True,
            "error": str(exc),
        }
        if RAG_QA_CACHE_ENABLED:
            save_library_qa_cache(conn, cache_key, lang, question, result)
        return result


def qa_cache_key(question: str, lang: str, limit: int) -> str:
    normalized = " ".join(question.lower().split())
    payload = f"{lang}:{limit}:{normalized}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def build_library_evidence(conn: sqlite3.Connection, question: str, limit: int = 12) -> list[dict[str, Any]]:
    sources = hybrid_search_chunks(conn, question, limit=limit)
    evidence = [format_chunk_source(index + 1, source) for index, source in enumerate(sources)]
    seen_documents = {int(item["document_id"]) for item in evidence if item.get("document_id")}

    profile_sources = structured_project_sources(conn, question, limit=max(4, limit // 2))
    for source in profile_sources:
        document_id = int(source["document_id"])
        if document_id in seen_documents and len(evidence) >= limit:
            continue
        source["source_id"] = len(evidence) + 1
        evidence.append(source)
        seen_documents.add(document_id)
        if len(evidence) >= limit:
            break
    return evidence[:limit]


def format_chunk_source(source_id: int, source: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_id": source_id,
        "document_id": source.get("document_id"),
        "file_name": source.get("file_name"),
        "page": source.get("page"),
        "match_type": source.get("match_type"),
        "snippet": source.get("snippet", ""),
    }


def structured_project_sources(conn: sqlite3.Connection, question: str, limit: int = 6) -> list[dict[str, Any]]:
    query_tokens = set(tokens(question))
    rows = []
    for project in list_projects(conn):
        text = project_profile_text(project)
        project_tokens = set(tokens(text))
        overlap = len(query_tokens & project_tokens)
        if project.get("ai_related") and any(token in query_tokens for token in {"ai", "人工智能", "智能"}):
            overlap += 2
        if overlap <= 0 and query_tokens:
            continue
        rows.append((overlap, project, text))
    rows.sort(key=lambda item: (item[0], int(item[1].get("document_id") or 0)), reverse=True)
    return [
        {
            "source_id": index + 1,
            "document_id": project.get("document_id"),
            "file_name": project.get("file_name"),
            "page": None,
            "match_type": "profile",
            "snippet": text[:900],
        }
        for index, (_, project, text) in enumerate(rows[:limit])
    ]


def project_profile_text(project: dict[str, Any]) -> str:
    parts = [
        f"Project: {project.get('project_name') or ''}",
        f"Company: {project.get('company_name') or ''}",
        f"Industry: {project.get('industry') or ''}",
        f"AI related: {'yes' if project.get('ai_related') else 'no'}",
        f"AI category: {', '.join(project.get('ai_category') or [])}",
        f"Funding stage: {project.get('financing_stage') or ''}",
        f"Business model: {project.get('business_model') or ''}",
        f"Team: {'; '.join(project.get('team_highlights') or [])}",
        f"Traction: {'; '.join(project.get('traction') or [])}",
        f"Summary: {project.get('one_line_summary') or ''}",
        f"Recommendation: {project.get('recommendation') or ''}",
        f"Risks: {'; '.join(project.get('risks') or [])}",
        f"Tags: {', '.join(project.get('tags') or [])}",
    ]
    return "\n".join(part for part in parts if part.strip())


def tokens(text: str) -> list[str]:
    normalized = text.lower()
    return re.findall(r"[a-z0-9_]{2,}|[\u4e00-\u9fff]{2,}", normalized)


def fallback_answer(question: str, evidence: list[dict[str, Any]], lang: str, error: str = "") -> str:
    top_sources = evidence[:5]
    if lang == "en":
        lines = [
            "The AI answer could not be generated, so here is an evidence-only summary from retrieved BP data.",
        ]
        if error:
            lines.append(f"LLM error: {error}")
        for source in top_sources:
            page = f", p.{source.get('page')}" if source.get("page") else ""
            lines.append(
                f"- [source {source.get('source_id')}: {source.get('file_name')}{page}] "
                f"{str(source.get('snippet') or '').strip()[:260]}"
            )
        return "\n".join(lines)

    lines = ["AI 回答暂时生成失败，下面先给出基于已检索 BP 证据的摘要。"]
    if error:
        lines.append(f"LLM 错误：{error}")
    for source in top_sources:
        page = f"，第 {source.get('page')} 页" if source.get("page") else ""
        lines.append(
            f"- [来源 {source.get('source_id')}：{source.get('file_name')}{page}] "
            f"{str(source.get('snippet') or '').strip()[:260]}"
        )
    return "\n".join(lines)
