from __future__ import annotations

from pathlib import Path

from docx import Document
from pptx import Presentation
from pypdf import PdfReader


SUPPORTED_SUFFIXES = {".pdf", ".pptx", ".docx", ".txt", ".md"}


def extract_pages(path: Path) -> list[tuple[int | None, str]]:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return extract_pdf(path)
    if suffix == ".pptx":
        return extract_pptx(path)
    if suffix == ".docx":
        return extract_docx(path)
    if suffix in {".txt", ".md"}:
        return [(None, path.read_text(encoding="utf-8", errors="ignore"))]
    raise ValueError(f"暂不支持的文件类型：{suffix}")


def extract_pdf(path: Path) -> list[tuple[int | None, str]]:
    reader = PdfReader(str(path))
    pages: list[tuple[int | None, str]] = []
    for index, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append((index, clean_text(text)))
    return pages


def extract_pptx(path: Path) -> list[tuple[int | None, str]]:
    presentation = Presentation(str(path))
    pages: list[tuple[int | None, str]] = []
    for index, slide in enumerate(presentation.slides, start=1):
        parts: list[str] = []
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                parts.append(shape.text)
        pages.append((index, clean_text("\n".join(parts))))
    return pages


def extract_docx(path: Path) -> list[tuple[int | None, str]]:
    doc = Document(str(path))
    parts = [paragraph.text for paragraph in doc.paragraphs]
    return [(None, clean_text("\n".join(parts)))]


def clean_text(text: str) -> str:
    lines = [line.strip() for line in text.replace("\x00", " ").splitlines()]
    return "\n".join(line for line in lines if line)


def chunk_pages(
    pages: list[tuple[int | None, str]],
    max_chars: int = 1800,
    overlap: int = 200,
) -> list[tuple[int | None, int, str]]:
    chunks: list[tuple[int | None, int, str]] = []
    chunk_index = 0
    for page, text in pages:
        if not text.strip():
            continue
        start = 0
        while start < len(text):
            end = min(start + max_chars, len(text))
            chunk = text[start:end].strip()
            if chunk:
                chunks.append((page, chunk_index, chunk))
                chunk_index += 1
            if end >= len(text):
                break
            start = max(0, end - overlap)
    return chunks


def sample_for_llm(pages: list[tuple[int | None, str]], max_chars: int = 18000) -> str:
    selected: list[str] = []
    total = 0
    for page, text in pages:
        if not text.strip():
            continue
        prefix = f"\n\n[第{page}页]\n" if page else "\n\n[文档]\n"
        block = prefix + text.strip()
        if total + len(block) > max_chars:
            selected.append(block[: max_chars - total])
            break
        selected.append(block)
        total += len(block)
    return "".join(selected).strip()

