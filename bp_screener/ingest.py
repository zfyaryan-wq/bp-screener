from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .config import DB_PATH, INBOX_DIR
from .db import connect, get_document_for_path, mark_failed, replace_chunks, save_project_translation, upsert_document, upsert_project
from .extractor import extract_profile
from .parsers import SUPPORTED_SUFFIXES, chunk_pages, extract_pages, sample_for_llm
from .services.translation import translate_project_profile


MISSING_PROFILE_CONDITION = """
(
  p.document_id IS NULL
  OR p.screening_score IS NULL OR p.screening_score <= 0
  OR p.team_score IS NULL OR p.team_score <= 0
  OR p.traction_score IS NULL OR p.traction_score <= 0
  OR p.risk_level IS NULL OR TRIM(p.risk_level) = '' OR p.risk_level = '未知'
  OR p.recommendation IS NULL OR TRIM(p.recommendation) = '' OR p.recommendation = '未知'
)
"""


def log(message: str) -> None:
    encoding = sys.stdout.encoding or "utf-8"
    safe_message = message.encode(encoding, errors="replace").decode(encoding, errors="replace")
    print(safe_message, flush=True)


def iter_files(path: Path) -> list[Path]:
    if path.is_file():
        return [path.resolve()]
    files = [p.resolve() for p in path.rglob("*") if p.is_file() and p.suffix.lower() in SUPPORTED_SUFFIXES]
    return sorted(files)


def ingest_path(
    path: Path,
    use_llm: bool = True,
    limit: int | None = None,
    force: bool = False,
    db_path: Path | None = None,
) -> tuple[int, int]:
    files = iter_files(path)
    if limit:
        files = files[:limit]

    ok = 0
    failed = 0
    with connect(db_path or DB_PATH) as conn:
        for file_path in files:
            existing = get_document_for_path(conn, file_path)
            if (
                not force
                and existing
                and existing.get("status") == "done"
                and not existing.get("deleted_at")
                and int(existing.get("file_size") or 0) == file_path.stat().st_size
            ):
                log(f"[SKIP] {file_path.name}")
                continue
            document_id = upsert_document(conn, file_path)
            try:
                pages = extract_pages(file_path)
                chunks = chunk_pages(pages)
                replace_chunks(conn, document_id, file_path.name, chunks)
                profile = extract_profile(sample_for_llm(pages), use_llm=use_llm)
                upsert_project(conn, document_id, profile)
                if use_llm:
                    translation_chunks = [
                        {"page": page, "chunk_index": chunk_index, "content": content}
                        for page, chunk_index, content in chunks
                    ]
                    project_payload = profile.model_dump()
                    for lang, target_language in {"en": "English", "zh": "Chinese"}.items():
                        translated_profile = translate_project_profile(project_payload, translation_chunks, target_language=target_language)
                        save_project_translation(conn, document_id, translated_profile, lang=lang)
                conn.commit()
                ok += 1
                log(f"[OK] {file_path.name}")
            except Exception as exc:
                mark_failed(conn, document_id, str(exc))
                conn.commit()
                failed += 1
                log(f"[FAILED] {file_path.name}: {exc}")
    return ok, failed


def selected_document_paths(
    document_ids: list[int] | None = None,
    missing_profile_fields: bool = False,
    db_path: Path | None = None,
) -> list[Path]:
    conditions = ["d.deleted_at IS NULL"]
    params: list[object] = []
    if document_ids:
        placeholders = ", ".join("?" for _ in document_ids)
        conditions.append(f"d.id IN ({placeholders})")
        params.extend(document_ids)
    if missing_profile_fields:
        conditions.append(MISSING_PROFILE_CONDITION)

    with connect(db_path or DB_PATH) as conn:
        rows = conn.execute(
            f"""
            SELECT d.id, d.file_path
            FROM documents d
            LEFT JOIN projects p ON p.document_id = d.id
            WHERE {" AND ".join(conditions)}
            ORDER BY d.id
            """,
            params,
        ).fetchall()

    paths: list[Path] = []
    for row in rows:
        file_path = Path(str(row["file_path"])).resolve()
        if not file_path.exists():
            log(f"[MISSING FILE] document_id={row['id']} {file_path}")
            continue
        paths.append(file_path)
    return paths


def main() -> None:
    parser = argparse.ArgumentParser(description="批量导入并结构化 BP 文件")
    parser.add_argument("path", nargs="?", default=str(INBOX_DIR), help="文件或文件夹路径")
    parser.add_argument("--db", type=Path, default=DB_PATH, help="SQLite database path")
    parser.add_argument("--document-id", type=int, action="append", default=[], help="只重跑指定 document_id；可重复")
    parser.add_argument("--missing-profile-fields", action="store_true", help="只重跑评分、风险或推荐缺失的已导入文档")
    parser.add_argument("--limit", type=int, default=None, help="最多处理多少个文件")
    parser.add_argument("--no-llm", action="store_true", help="不调用模型，只做启发式抽取")
    parser.add_argument("--force", action="store_true", help="强制重跑已完成文件")
    args = parser.parse_args()

    if args.document_id or args.missing_profile_fields:
        paths = selected_document_paths(
            document_ids=args.document_id,
            missing_profile_fields=args.missing_profile_fields,
            db_path=args.db,
        )
        if args.limit:
            paths = paths[: args.limit]
        ok = 0
        failed = 0
        for path in paths:
            path_ok, path_failed = ingest_path(path, use_llm=not args.no_llm, force=True, db_path=args.db)
            ok += path_ok
            failed += path_failed
    else:
        ok, failed = ingest_path(Path(args.path), use_llm=not args.no_llm, limit=args.limit, force=args.force, db_path=args.db)
    log(f"完成：成功 {ok}，失败 {failed}")


if __name__ == "__main__":
    main()

