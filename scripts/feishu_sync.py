from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

from bp_screener.config import FEISHU_BASE_APP_TOKEN, FEISHU_BASE_TABLE_ID, FEISHU_BP_FOLDER_TOKEN
from bp_screener.db import connect
from bp_screener.feishu import FeishuClient, FeishuFile


DEFAULT_OUTPUT = ROOT / "data" / "feishu_files.json"


def normalize_name(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip()).lower()


def list_files(folder_token: str) -> list[FeishuFile]:
    client = FeishuClient()
    return client.list_folder_files(folder_token, recursive=True)


def write_file_index(files: list[FeishuFile], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = [file.__dict__ for file in files]
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


def load_file_index(path: Path) -> list[FeishuFile]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return [FeishuFile(**item) for item in payload]


def update_local_links(files: list[FeishuFile], dry_run: bool = False) -> tuple[int, int, int]:
    by_name: dict[str, FeishuFile] = {}
    duplicates: set[str] = set()
    for file in files:
        if file.type == "folder":
            continue
        key = normalize_name(file.name)
        if key in by_name:
            duplicates.add(key)
            continue
        by_name[key] = file

    matched = 0
    unmatched = 0
    skipped_duplicate = 0
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT id, file_name, file_path
            FROM documents
            WHERE deleted_at IS NULL
            ORDER BY id
            """
        ).fetchall()
        for row in rows:
            key = normalize_name(row["file_name"])
            if key in duplicates:
                skipped_duplicate += 1
                continue
            file = by_name.get(key)
            if not file:
                unmatched += 1
                continue
            matched += 1
            if not dry_run:
                conn.execute(
                    """
                    UPDATE documents
                    SET source_platform = 'feishu',
                        source_external_id = ?,
                        source_url = ?,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?
                    """,
                    (file.token, file.url, int(row["id"])),
                )
        if not dry_run:
            conn.commit()
    return matched, unmatched, skipped_duplicate


def check_bitable(app_token: str, table_id: str) -> int:
    client = FeishuClient()
    return len(client.list_bitable_records(app_token, table_id, page_size=20))


def main() -> None:
    load_dotenv(ROOT / ".env")
    parser = argparse.ArgumentParser(description="Sync Feishu Drive file links into BP Screener.")
    parser.add_argument("--folder-token", default=FEISHU_BP_FOLDER_TOKEN)
    parser.add_argument("--base-app-token", default=FEISHU_BASE_APP_TOKEN)
    parser.add_argument("--table-id", default=FEISHU_BASE_TABLE_ID)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--use-cache", action="store_true", help="Use an existing data/feishu_files.json file.")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.use_cache and args.output.exists():
        files = load_file_index(args.output)
    else:
        if not args.folder_token:
            raise SystemExit("FEISHU_BP_FOLDER_TOKEN is not configured.")
        files = list_files(args.folder_token)
        write_file_index(files, args.output)

    matched, unmatched, skipped_duplicate = update_local_links(files, dry_run=args.dry_run)
    print(f"Feishu files indexed: {len(files)}")
    print(f"Local documents matched: {matched}")
    print(f"Local documents unmatched: {unmatched}")
    print(f"Local documents skipped due to duplicate Feishu names: {skipped_duplicate}")
    print(f"Index written to: {args.output}")

    if args.base_app_token and args.table_id:
        try:
            record_count = check_bitable(args.base_app_token, args.table_id)
            print(f"Bitable reachable, sampled records: {record_count}")
        except Exception as exc:
            print(f"Bitable check failed: {exc}")


if __name__ == "__main__":
    main()
