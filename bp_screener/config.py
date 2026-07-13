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

OCR_ENABLED = os.getenv("OCR_ENABLED", "true").lower() == "true"
OCR_LANG = os.getenv("OCR_LANG", "eng+chi_sim")
OCR_MIN_PAGE_CHARS = int(os.getenv("OCR_MIN_PAGE_CHARS", "80"))
OCR_MIN_DOCUMENT_CHARS = int(os.getenv("OCR_MIN_DOCUMENT_CHARS", "800"))
OCR_MAX_PAGES = int(os.getenv("OCR_MAX_PAGES", "25"))
OCR_DPI = int(os.getenv("OCR_DPI", "180"))
TESSERACT_CMD = os.getenv("TESSERACT_CMD", "").strip()
OCR_TESSDATA_DIR_VALUE = os.getenv("OCR_TESSDATA_DIR", "").strip()
OCR_TESSDATA_DIR = str(project_path(OCR_TESSDATA_DIR_VALUE)) if OCR_TESSDATA_DIR_VALUE else ""
PDF_TEXT_ENGINE = os.getenv("PDF_TEXT_ENGINE", "pymupdf").strip().lower()

RAG_KEYWORD_PREFILTER_LIMIT = int(os.getenv("RAG_KEYWORD_PREFILTER_LIMIT", "80"))
RAG_SEMANTIC_MAX_ROWS = int(os.getenv("RAG_SEMANTIC_MAX_ROWS", "20000"))
RAG_QA_CACHE_ENABLED = os.getenv("RAG_QA_CACHE_ENABLED", "true").lower() == "true"

