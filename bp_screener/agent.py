from __future__ import annotations

import json
from typing import Any

from .config import LLM_MAX_TOKENS
from .llm_client import chat_completion
from .llm_json import loads_llm_json


SYSTEM_PROMPT = """你是一个 BP 项目分析 Agent，帮助学生团队快速理解和筛选创业项目。
回答必须基于给定项目档案和原文片段，不要编造。
如果证据不足，请明确说“目前材料中没有看到”。
回答要具体、直接，适合投资筛选场景。
用户用中文问就中文回答，用户用英文问就英文回答。"""


TRANSLATION_SYSTEM_PROMPT = """You translate BP screening profiles for a small student review team.
Translate Chinese or mixed-language project profile fields into clear, professional English.
Preserve factual meaning. Do not add new facts.
Keep IDs, numbers, company names, product names, and financing terms accurate.
Return valid JSON only. Do not return Markdown."""


TRANSLATION_USER_PROMPT = """Translate this structured BP profile into English.

Rules:
- Translate project summary, industry, AI categories, business model, team highlights, traction, customers/users, revenue/financials, risks, tags, and evidence fields.
- Translate evidence.quote into English for readability.
- Keep recommendation unchanged as one of 高 / 中 / 低 / 未知.
- Keep ai_related as a boolean.
- Preserve the same JSON keys.

Project profile:
{profile}

Optional source snippets for context:
{snippets}
"""


def answer_project_question(
    project: dict[str, Any],
    chunks: list[dict[str, Any]],
    question: str,
    history: list[dict[str, str]] | None = None,
) -> str:
    context = {
        "project": project,
        "source_chunks": [
            {
                "page": chunk.get("page"),
                "content": chunk.get("content", "")[:1800],
            }
            for chunk in chunks
        ],
    }
    messages: list[dict[str, str]] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {
            "role": "user",
            "content": "项目上下文如下，请后续回答都基于这些材料：\n"
            + json.dumps(context, ensure_ascii=False),
        },
    ]
    if history:
        messages.extend(history[-8:])
    messages.append({"role": "user", "content": question})

    response = chat_completion(
        messages=messages,
        temperature=0.2,
        max_tokens=min(LLM_MAX_TOKENS, 2048),
    )
    return response.choices[0].message.content or ""


def translate_project_profile(project: dict[str, Any], chunks: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    snippets = [
        {
            "page": chunk.get("page"),
            "content": chunk.get("content", "")[:1200],
        }
        for chunk in (chunks or [])[:6]
    ]
    response = chat_completion(
        messages=[
            {"role": "system", "content": TRANSLATION_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": TRANSLATION_USER_PROMPT.format(
                    profile=json.dumps(project, ensure_ascii=False),
                    snippets=json.dumps(snippets, ensure_ascii=False),
                ),
            },
        ],
        temperature=0.1,
        max_tokens=min(LLM_MAX_TOKENS, 3000),
        response_format={"type": "json_object"},
    )
    translated = loads_llm_json(response.choices[0].message.content)
    merged = dict(project)
    merged.update(translated)
    return merged
