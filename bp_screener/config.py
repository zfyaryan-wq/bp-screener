from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")


def project_path(value: str) -> Path:
    path = Path(value)
    return path if path.is_absolute() else ROOT / path


DB_PATH = project_path(os.getenv("BP_DB_PATH", "data/bp_screener.sqlite"))
INBOX_DIR = project_path(os.getenv("BP_INBOX_DIR", "data/inbox"))

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://llm-center.modelbest.cn/llm/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "replace-with-your-local-api-key")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-v3.2")
LLM_PROVIDER_ID = os.getenv("LLM_PROVIDER_ID", "").strip()
LLM_ENABLE_THINKING = os.getenv("LLM_ENABLE_THINKING", "false").lower() == "true"
LLM_MAX_TOKENS = int(os.getenv("LLM_MAX_TOKENS", "4096"))
LLM_TIMEOUT_SECONDS = float(os.getenv("LLM_TIMEOUT_SECONDS", "120"))

