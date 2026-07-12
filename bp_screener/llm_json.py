from __future__ import annotations

import json
import re
from typing import Any


def loads_llm_json(content: str | None) -> dict[str, Any]:
    text = (content or "{}").strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
        text = re.sub(r"\s*```$", "", text)
    try:
        value = json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if not match:
            raise
        value = json.loads(match.group(0))
    return value if isinstance(value, dict) else {}
