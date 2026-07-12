from __future__ import annotations

import json

from bp_screener.config import LLM_MAX_TOKENS
from bp_screener.llm_client import chat_completion
from bp_screener.llm_json import loads_llm_json


def translate_project_profile(
    project: dict,
    chunks: list[dict] | None = None,
    target_language: str = "English",
) -> dict:
    snippets = [
        {
            "page": chunk.get("page"),
            "content": chunk.get("content", "")[:1200],
        }
        for chunk in (chunks or [])[:6]
    ]
    response = chat_completion(
        messages=[
            {
                "role": "system",
                "content": (
                    "You translate BP screening profiles for a small student review team. "
                    f"Translate project profile fields into clear, professional {target_language}. "
                    "Preserve factual meaning and do not add new facts. "
                    "Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Translate this structured BP profile into {target_language}. Preserve the same JSON keys. "
                    "Keep recommendation unchanged as one of 高 / 中 / 低 / 未知. "
                    "Keep ai_related as a boolean. Translate evidence.quote for readability.\n\n"
                    f"Project profile:\n{json.dumps(project, ensure_ascii=False)}\n\n"
                    f"Optional source snippets:\n{json.dumps(snippets, ensure_ascii=False)}"
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
