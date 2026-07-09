from __future__ import annotations

import argparse
from pathlib import Path

from .config import INBOX_DIR
from .db import connect, mark_failed, replace_chunks, upsert_document, upsert_project
from .extractor import extract_profile
from .parsers import SUPPORTED_SUFFIXES, chunk_pages, extract_pages, sample_for_llm


def iter_files(path: Path) -> list[Path]:
    if path.is_file():
        return [path]
    files = [p for p in path.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED_SUFFIXES]
    return sorted(files)


def ingest_path(path: Path, use_llm: bool = True, limit: int | None = None) -> tuple[int, int]:
    files = iter_files(path)
    if limit:
        files = files[:limit]

    ok = 0
    failed = 0
    with connect() as conn:
        for file_path in files:
            document_id = upsert_document(conn, file_path)
            try:
                pages = extract_pages(file_path)
                chunks = chunk_pages(pages)
                replace_chunks(conn, document_id, file_path.name, chunks)
                profile = extract_profile(sample_for_llm(pages), use_llm=use_llm)
                upsert_project(conn, document_id, profile)
                ok += 1
                print(f"[OK] {file_path.name}")
            except Exception as exc:
                mark_failed(conn, document_id, str(exc))
                failed += 1
                print(f"[FAILED] {file_path.name}: {exc}")
    return ok, failed


def main() -> None:
    parser = argparse.ArgumentParser(description="批量导入并结构化 BP 文件")
    parser.add_argument("path", nargs="?", default=str(INBOX_DIR), help="文件或文件夹路径")
    parser.add_argument("--limit", type=int, default=None, help="最多处理多少个文件")
    parser.add_argument("--no-llm", action="store_true", help="不调用模型，只做启发式抽取")
    args = parser.parse_args()

    ok, failed = ingest_path(Path(args.path), use_llm=not args.no_llm, limit=args.limit)
    print(f"完成：成功 {ok}，失败 {failed}")


if __name__ == "__main__":
    main()

