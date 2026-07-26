from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATABASE = "bp-screener"
JOB_STATUSES = {"queued", "processing", "done", "failed"}


@dataclass
class IngestJob:
    id: int
    document_id: int
    file_name: str
    source_platform: str
    source_external_id: str
    source_url: str
    status: str
    attempts: int
    error_message: str
    created_at: str
    updated_at: str
    claimed_at: str
    completed_at: str


class D1Client:
    def __init__(self, database: str, remote: bool = True) -> None:
        self.database = database
        self.remote = remote

    def execute(self, sql: str) -> list[dict[str, Any]]:
        command = [resolve_npx(), "wrangler", "d1", "execute", self.database]
        command.append("--remote" if self.remote else "--local")
        command.extend(["--command", " ".join(sql.split()), "--json"])
        completed = subprocess.run(
            command,
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        payload = json.loads(completed.stdout or "[]")
        return extract_rows(payload)


def resolve_npx() -> str:
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        raise SystemExit("npx was not found on PATH. Install Node.js/npm or run Wrangler directly.")
    return npx


def sql_quote(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def extract_rows(payload: Any) -> list[dict[str, Any]]:
    if isinstance(payload, list):
        rows: list[dict[str, Any]] = []
        for item in payload:
            rows.extend(extract_rows(item))
        return rows
    if isinstance(payload, dict):
        results = payload.get("results")
        if isinstance(results, list) and all(isinstance(row, dict) for row in results):
            return results
        result = payload.get("result")
        if result is not None:
            return extract_rows(result)
    return []


def normalize_statuses(statuses: list[str]) -> list[str]:
    normalized = [status.strip().lower() for status in statuses if status.strip()]
    invalid = sorted(set(normalized) - JOB_STATUSES)
    if invalid:
        raise SystemExit(f"Unknown status: {', '.join(invalid)}")
    return normalized or ["queued"]


def job_select_sql(where: str = "1 = 1", limit: int = 20) -> str:
    return f"""
SELECT
  j.id,
  j.document_id,
  d.file_name,
  j.source_platform,
  j.source_external_id,
  j.source_url,
  j.status,
  j.attempts,
  COALESCE(j.error_message, '') AS error_message,
  j.created_at,
  j.updated_at,
  COALESCE(j.claimed_at, '') AS claimed_at,
  COALESCE(j.completed_at, '') AS completed_at
FROM ingest_jobs j
JOIN documents d ON d.id = j.document_id
WHERE {where}
ORDER BY j.created_at, j.id
LIMIT {int(limit)}
""".strip()


def list_jobs(client: D1Client, statuses: list[str], limit: int) -> list[IngestJob]:
    status_list = ", ".join(sql_quote(status) for status in statuses)
    rows = client.execute(job_select_sql(f"j.status IN ({status_list})", limit))
    return [IngestJob(**row) for row in rows]


def status_counts(client: D1Client) -> list[dict[str, Any]]:
    return client.execute(
        """
SELECT status, COUNT(*) AS count, MIN(created_at) AS oldest_created_at, MAX(updated_at) AS newest_updated_at
FROM ingest_jobs
GROUP BY status
ORDER BY status
""".strip()
    )


def claim_jobs(client: D1Client, limit: int, apply: bool) -> list[IngestJob]:
    jobs = list_jobs(client, ["queued"], limit)
    if not jobs:
        return []
    ids = ", ".join(str(job.id) for job in jobs)
    document_ids = ", ".join(str(job.document_id) for job in jobs)
    sql = f"""
UPDATE ingest_jobs
SET status = 'processing',
    attempts = attempts + 1,
    error_message = NULL,
    claimed_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ({ids}) AND status = 'queued';

UPDATE documents
SET status = 'processing',
    updated_at = CURRENT_TIMESTAMP
WHERE id IN ({document_ids});
""".strip()
    if not apply:
        print("Dry run: would claim these queued jobs. Re-run with --apply to update D1.")
        print(sql)
        return jobs
    client.execute(sql)
    return [IngestJob(**row) for row in client.execute(job_select_sql(f"j.id IN ({ids})", limit))]


def update_job_status(client: D1Client, job_id: int, status: str, apply: bool, error_message: str = "") -> None:
    if status not in {"queued", "done", "failed"}:
        raise SystemExit("mark-status only supports queued, done, or failed.")
    row = client.execute(job_select_sql(f"j.id = {int(job_id)}", 1))
    if not row:
        raise SystemExit(f"No ingest job found for id={job_id}.")
    document_status = "uploaded" if status == "queued" else status
    completed_at = "CURRENT_TIMESTAMP" if status == "done" else "NULL"
    error_sql = "NULL" if not error_message else sql_quote(error_message[:1000])
    sql = f"""
UPDATE ingest_jobs
SET status = {sql_quote(status)},
    error_message = {error_sql},
    claimed_at = CASE WHEN {sql_quote(status)} = 'queued' THEN NULL ELSE claimed_at END,
    completed_at = {completed_at},
    updated_at = CURRENT_TIMESTAMP
WHERE id = {int(job_id)};

UPDATE documents
SET status = {sql_quote(document_status)},
    updated_at = CURRENT_TIMESTAMP
WHERE id = {int(row[0]["document_id"])};
""".strip()
    if not apply:
        print("Dry run: would update job status. Re-run with --apply to update D1.")
        print(sql)
        return
    client.execute(sql)


def print_jobs(jobs: list[IngestJob]) -> None:
    if not jobs:
        print("No ingest jobs found.")
        return
    for job in jobs:
        print(
            f"#{job.id} doc={job.document_id} status={job.status} attempts={job.attempts} "
            f"file={job.file_name} source={job.source_platform}:{job.source_external_id} "
            f"url={job.source_url or '-'}"
        )


def print_counts(rows: list[dict[str, Any]]) -> None:
    if not rows:
        print("No ingest_jobs rows found.")
        return
    for row in rows:
        print(
            f"{row.get('status')}: {row.get('count')} "
            f"oldest={row.get('oldest_created_at') or '-'} newest={row.get('newest_updated_at') or '-'}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Operate D1 ingest_jobs for uploaded BPs. This first version only lists, claims, "
            "and marks job state; Feishu file download and structured upsert are intentionally "
            "left as the next integration step to avoid hard-coded secrets."
        )
    )
    parser.add_argument("command", choices=["list", "status", "claim", "mark-status"], nargs="?", default="list")
    parser.add_argument("--database", default=DEFAULT_DATABASE)
    parser.add_argument("--local", action="store_true", help="Use local Wrangler D1 instead of remote D1.")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--status", action="append", default=[], help="Filter list by status; can be repeated.")
    parser.add_argument("--job-id", type=int, help="Required for mark-status.")
    parser.add_argument("--to", choices=["queued", "done", "failed"], help="Target status for mark-status.")
    parser.add_argument("--error-message", default="")
    parser.add_argument("--apply", action="store_true", help="Actually mutate D1. Without this, mutations are dry-run.")
    parser.add_argument("--json", action="store_true", help="Print rows as JSON.")
    args = parser.parse_args()

    client = D1Client(args.database, remote=not args.local)

    if args.command == "status":
        rows = status_counts(client)
        print(json.dumps(rows, ensure_ascii=False, indent=2) if args.json else "", end="")
        if not args.json:
            print_counts(rows)
        return

    if args.command == "claim":
        jobs = claim_jobs(client, args.limit, args.apply)
        if args.json:
            print(json.dumps([job.__dict__ for job in jobs], ensure_ascii=False, indent=2))
        else:
            print_jobs(jobs)
        return

    if args.command == "mark-status":
        if not args.job_id or not args.to:
            raise SystemExit("mark-status requires --job-id and --to.")
        update_job_status(client, args.job_id, args.to, args.apply, args.error_message)
        print(f"Job {args.job_id} status update {'applied' if args.apply else 'dry-run only'}.")
        return

    jobs = list_jobs(client, normalize_statuses(args.status), args.limit)
    if args.json:
        print(json.dumps([job.__dict__ for job in jobs], ensure_ascii=False, indent=2))
    else:
        print_jobs(jobs)


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        sys.stderr.write(exc.stderr or str(exc))
        raise SystemExit(exc.returncode) from exc
