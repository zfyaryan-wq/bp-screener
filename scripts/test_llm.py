from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from bp_screener.config import (
    LLM_API_KEY,
)
from bp_screener.llm_client import chat_completion
from bp_screener.llm_json import loads_llm_json


def main() -> None:
    if not LLM_API_KEY or LLM_API_KEY == "replace-with-your-local-api-key":
        raise SystemExit("Please set LLM_API_KEY in .env before testing the LLM connection.")

    response = chat_completion(
        messages=[
            {"role": "system", "content": "Return valid JSON only."},
            {"role": "user", "content": "Return {\"ok\": true, \"provider\": \"modelbest-deepseek\"}."},
        ],
        temperature=0,
        max_tokens=128,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content or "{}"
    data = loads_llm_json(content)
    print(f"LLM connection OK: provider={data.get('provider', 'unknown')}")


if __name__ == "__main__":
    main()
