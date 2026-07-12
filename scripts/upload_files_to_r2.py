from __future__ import annotations

import argparse
import shutil
import sqlite3
import subprocess
from pathlib import Path

from sync_to_d1 import DEFAULT_LOCAL_DB, ROOT, object_key


def upload_files(local_db: Path, bucket: str, limit: int | None = None) -> tuple[int, int]:
    npx = shutil.which("npx") or shutil.which("npx.cmd")
    if not npx:
        raise RuntimeError("npx is not available in PATH.")

    conn = sqlite3.connect(local_db)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        """
        SELECT id, file_name, file_path
        FROM documents
        WHERE status = 'done'
        ORDER BY id
        """
    ).fetchall()
    if limit:
        rows = rows[:limit]

    ok = 0
    failed = 0
    for row in rows:
        path = Path(row["file_path"])
        if not path.exists():
            print(f"[FAILED] missing file: {path}")
            failed += 1
            continue

        key = object_key(int(row["id"]), row["file_name"])
        target = f"{bucket}/{key}"
        try:
            subprocess.run(
                [npx, "wrangler", "r2", "object", "put", target, "--file", str(path), "--remote"],
                check=True,
                cwd=ROOT,
            )
            ok += 1
            print(f"[OK] {target}")
        except subprocess.CalledProcessError as exc:
            failed += 1
            print(f"[FAILED] {target}: {exc}")

    return ok, failed


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload local BP source files to Cloudflare R2.")
    parser.add_argument("--local-db", type=Path, default=DEFAULT_LOCAL_DB)
    parser.add_argument("--bucket", default="bp-screener-files")
    parser.add_argument("--limit", type=int, default=None)
    args = parser.parse_args()

    ok, failed = upload_files(args.local_db, args.bucket, args.limit)
    print(f"Finished: {ok} uploaded, {failed} failed")


if __name__ == "__main__":
    main()
