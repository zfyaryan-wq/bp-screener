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

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "http://localhost:23333/v1")
LLM_API_KEY = os.getenv("LLM_API_KEY", "not-needed-for-local")
LLM_MODEL = os.getenv("LLM_MODEL", "deepseek-chat")

