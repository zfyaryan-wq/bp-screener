from __future__ import annotations

import re
import shutil
from pathlib import Path


STATIC_PREVIEW_DIR = Path("static") / "bp_previews"


def pdf_preview_url(path: Path, document_id: int) -> str:
    STATIC_PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", path.stem).strip("-") or "bp"
    fingerprint = f"{int(path.stat().st_mtime)}-{path.stat().st_size}"
    preview_name = f"{document_id}-{fingerprint}-{safe_name}.pdf"
    preview_path = STATIC_PREVIEW_DIR / preview_name
    if not preview_path.exists():
        shutil.copyfile(path, preview_path)
    return f"/app/static/bp_previews/{preview_name}"


def pdf_preview_html(path: Path, document_id: int) -> str:
    url = pdf_preview_url(path, document_id)
    return f"""
    <iframe
        src="{url}"
        width="100%"
        height="720"
        style="border: 1px solid #e5e7eb; border-radius: 12px;"
    ></iframe>
    """


def cleanup_pdf_previews(document_id: int) -> None:
    if not STATIC_PREVIEW_DIR.exists():
        return
    for preview_path in STATIC_PREVIEW_DIR.glob(f"{document_id}-*.pdf"):
        preview_path.unlink(missing_ok=True)
