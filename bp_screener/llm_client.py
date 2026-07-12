from __future__ import annotations

from typing import Any

from openai import OpenAI

from .config import (
    LLM_API_KEY,
    LLM_BASE_URL,
    LLM_ENABLE_THINKING,
    LLM_MAX_TOKENS,
    LLM_MODEL,
    LLM_PROVIDER_ID,
    LLM_TIMEOUT_SECONDS,
)


def llm_extra_body(extra_body: dict[str, Any] | None = None) -> dict[str, Any]:
    body: dict[str, Any] = {"enable_thinking": LLM_ENABLE_THINKING}
    if LLM_PROVIDER_ID:
        body["providerId"] = LLM_PROVIDER_ID
    if extra_body:
        body.update(extra_body)
    return body


def chat_completion(**kwargs):
    client = OpenAI(base_url=LLM_BASE_URL, api_key=LLM_API_KEY, timeout=LLM_TIMEOUT_SECONDS)
    kwargs.setdefault("model", LLM_MODEL)
    kwargs["extra_body"] = llm_extra_body(kwargs.get("extra_body"))
    return client.chat.completions.create(**kwargs)


def capped_max_tokens(limit: int) -> int:
    return min(LLM_MAX_TOKENS, limit)
