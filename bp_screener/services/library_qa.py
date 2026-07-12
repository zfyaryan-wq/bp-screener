from __future__ import annotations

import json
import sqlite3
from typing import Any

from bp_screener.config import LLM_MAX_TOKENS
from bp_screener.llm_client import chat_completion
from bp_screener.search import hybrid_search_chunks


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
    sources = hybrid_search_chunks(conn, question, limit=limit)
    evidence = [
        {
            "source_id": index + 1,
            "document_id": source.get("document_id"),
            "file_name": source.get("file_name"),
            "page": source.get("page"),
            "match_type": source.get("match_type"),
            "snippet": source.get("snippet", ""),
        }
        for index, source in enumerate(sources)
    ]
    language_hint = "Answer in Chinese." if lang == "zh" else "Answer in English."
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
    return {
        "answer": response.choices[0].message.content or "",
        "sources": evidence,
    }
