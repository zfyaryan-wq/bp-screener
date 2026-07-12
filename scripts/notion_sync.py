from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

from bp_screener.config import DB_PATH
from bp_screener.db import activity_rows, connect, get_committee_review, get_project_review
from bp_screener.search import list_projects


NOTION_VERSION = "2022-06-28"


PROJECTS_SCHEMA = {
    "Project": {"title": {}},
    "BP ID": {"number": {"format": "number"}},
    "Company": {"rich_text": {}},
    "Industry": {"select": {}},
    "AI Related": {"checkbox": {}},
    "AI Category": {"multi_select": {}},
    "Funding Stage": {"select": {}},
    "Business Model": {"rich_text": {}},
    "Team Highlights": {"rich_text": {}},
    "Traction": {"rich_text": {}},
    "Customers / Users": {"rich_text": {}},
    "Revenue / Financials": {"rich_text": {}},
    "Recommendation": {"select": {}},
    "Committee Score": {"number": {"format": "number"}},
    "Committee Decision": {"select": {}},
    "Review Status": {"select": {}},
    "Owner": {"rich_text": {}},
    "Tags": {"multi_select": {}},
    "Summary": {"rich_text": {}},
    "Risks": {"rich_text": {}},
    "Evidence": {"rich_text": {}},
    "Source File": {"rich_text": {}},
    "Updated At": {"date": {}},
}

REVIEWS_SCHEMA = {
    "Review": {"title": {}},
    "BP ID": {"number": {"format": "number"}},
    "Project": {"rich_text": {}},
    "Status": {"select": {}},
    "Owner": {"rich_text": {}},
    "Note": {"rich_text": {}},
    "Updated At": {"date": {}},
}

COMMITTEE_SCHEMA = {
    "Committee Review": {"title": {}},
    "BP ID": {"number": {"format": "number"}},
    "Project": {"rich_text": {}},
    "Overall Score": {"number": {"format": "number"}},
    "Decision": {"select": {}},
    "Summary": {"rich_text": {}},
    "Analyst Reviews": {"rich_text": {}},
    "Red Team": {"rich_text": {}},
    "Key Questions": {"rich_text": {}},
    "Missing Info": {"rich_text": {}},
    "Next Steps": {"rich_text": {}},
    "Updated At": {"date": {}},
}

ACTIVITY_SCHEMA = {
    "Event": {"title": {}},
    "Log ID": {"number": {"format": "number"}},
    "Actor": {"rich_text": {}},
    "Action": {"select": {}},
    "BP ID": {"number": {"format": "number"}},
    "File": {"rich_text": {}},
    "Detail": {"rich_text": {}},
    "Time": {"date": {}},
}


class NotionClient:
    def __init__(self, token: str) -> None:
        self.token = token

    def request(self, method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        request = urllib.request.Request(
            f"https://api.notion.com/v1{path}",
            data=data,
            method=method,
            headers={
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json",
                "Notion-Version": NOTION_VERSION,
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read().decode("utf-8")
                return json.loads(body) if body else {}
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"Notion API {method} {path} failed: {exc.code} {body}") from exc

    def create_database(self, parent_page_id: str, title: str, properties: dict[str, Any]) -> str:
        response = self.request(
            "POST",
            "/databases",
            {
                "parent": {"type": "page_id", "page_id": normalize_uuid(parent_page_id)},
                "title": [{"type": "text", "text": {"content": title}}],
                "properties": properties,
            },
        )
        return str(response["id"])

    def create_page(self, database_id: str, properties: dict[str, Any]) -> str:
        response = self.request(
            "POST",
            "/pages",
            {
                "parent": {"database_id": normalize_uuid(database_id)},
                "properties": properties,
            },
        )
        return str(response["id"])

    def update_page(self, page_id: str, properties: dict[str, Any]) -> None:
        self.request("PATCH", f"/pages/{normalize_uuid(page_id)}", {"properties": properties})


def ensure_sync_tables(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS notion_sync_config (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS notion_sync_state (
          kind TEXT NOT NULL,
          local_id TEXT NOT NULL,
          notion_page_id TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY(kind, local_id)
        )
        """
    )


def config_get(conn: sqlite3.Connection, key: str) -> str:
    env_key = f"NOTION_{key.upper()}_DATABASE_ID"
    env_value = os.getenv(env_key, "").strip()
    if env_value:
        return env_value
    row = conn.execute("SELECT value FROM notion_sync_config WHERE key = ?", (key,)).fetchone()
    return str(row["value"]) if row else ""


def config_set(conn: sqlite3.Connection, key: str, value: str) -> None:
    conn.execute(
        """
        INSERT INTO notion_sync_config(key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """,
        (key, value),
    )


def setup_databases(conn: sqlite3.Connection, client: NotionClient, parent_page_id: str) -> dict[str, str]:
    created = {
        "projects": client.create_database(parent_page_id, "BP Projects", PROJECTS_SCHEMA),
        "reviews": client.create_database(parent_page_id, "BP Reviews", REVIEWS_SCHEMA),
        "committee": client.create_database(parent_page_id, "AI Committee Reviews", COMMITTEE_SCHEMA),
        "activity": client.create_database(parent_page_id, "BP Activity Logs", ACTIVITY_SCHEMA),
    }
    for key, value in created.items():
        config_set(conn, key, value)
    conn.commit()
    return created


def database_ids(conn: sqlite3.Connection) -> dict[str, str]:
    values = {key: config_get(conn, key) for key in ["projects", "reviews", "committee", "activity"]}
    missing = [key for key, value in values.items() if not value]
    if missing:
        names = ", ".join(missing)
        raise SystemExit(
            f"Missing Notion database IDs for: {names}. Run `python scripts\\notion_sync.py setup` first, "
            "or set NOTION_PROJECTS_DATABASE_ID / NOTION_REVIEWS_DATABASE_ID / "
            "NOTION_COMMITTEE_DATABASE_ID / NOTION_ACTIVITY_DATABASE_ID."
        )
    return values


def sync_all(conn: sqlite3.Connection, client: NotionClient, limit: int | None = None, dry_run: bool = False) -> None:
    ids = (
        {"projects": "dry-run", "reviews": "dry-run", "committee": "dry-run", "activity": "dry-run"}
        if dry_run
        else database_ids(conn)
    )
    projects = list_projects(conn)
    if limit is not None:
        projects = projects[:limit]
    print(f"Syncing {len(projects)} projects to Notion...")
    for project in projects:
        sync_project(conn, client, ids["projects"], project, dry_run=dry_run)
        sync_review(conn, client, ids["reviews"], project, dry_run=dry_run)
        sync_committee(conn, client, ids["committee"], project, dry_run=dry_run)

    logs = activity_rows(conn, limit=limit or 200)
    print(f"Syncing {len(logs)} activity logs to Notion...")
    for log in logs:
        sync_activity(conn, client, ids["activity"], log, dry_run=dry_run)
    conn.commit()


def sync_project(
    conn: sqlite3.Connection,
    client: NotionClient,
    database_id: str,
    project: dict[str, Any],
    dry_run: bool,
) -> None:
    document_id = int(project["document_id"])
    properties = {
        "Project": title(project.get("project_name") or project.get("file_name") or f"BP {document_id}"),
        "BP ID": number(document_id),
        "Company": text(project.get("company_name")),
        "Industry": select(project.get("industry")),
        "AI Related": checkbox(project.get("ai_related")),
        "AI Category": multi_select(project.get("ai_category")),
        "Funding Stage": select(project.get("financing_stage")),
        "Business Model": text(project.get("business_model")),
        "Team Highlights": text(join_list(project.get("team_highlights"))),
        "Traction": text(join_list(project.get("traction"))),
        "Customers / Users": text(project.get("customers_or_users")),
        "Revenue / Financials": text(project.get("revenue_or_financials")),
        "Recommendation": select(project.get("recommendation")),
        "Committee Score": number_or_empty(project.get("committee_score")),
        "Committee Decision": select(project.get("committee_decision")),
        "Review Status": select(project.get("review_status")),
        "Owner": text(project.get("owner")),
        "Tags": multi_select(project.get("tags")),
        "Summary": text(project.get("one_line_summary")),
        "Risks": text(join_list(project.get("risks"))),
        "Evidence": text(format_evidence(project.get("evidence"))),
        "Source File": text(project.get("file_path") or project.get("file_name")),
        "Updated At": date(project.get("updated_at")),
    }
    upsert_page(conn, client, "project", str(document_id), database_id, properties, dry_run)


def sync_review(
    conn: sqlite3.Connection,
    client: NotionClient,
    database_id: str,
    project: dict[str, Any],
    dry_run: bool,
) -> None:
    document_id = int(project["document_id"])
    review = get_project_review(conn, document_id)
    properties = {
        "Review": title(f"{project.get('project_name') or project.get('file_name')} review"),
        "BP ID": number(document_id),
        "Project": text(project.get("project_name")),
        "Status": select(review.get("review_status")),
        "Owner": text(review.get("owner")),
        "Note": text(review.get("note")),
        "Updated At": date(review.get("updated_at")),
    }
    upsert_page(conn, client, "review", str(document_id), database_id, properties, dry_run)


def sync_committee(
    conn: sqlite3.Connection,
    client: NotionClient,
    database_id: str,
    project: dict[str, Any],
    dry_run: bool,
) -> None:
    document_id = int(project["document_id"])
    review = get_committee_review(conn, document_id)
    if not review:
        return
    properties = {
        "Committee Review": title(f"{project.get('project_name') or project.get('file_name')} committee"),
        "BP ID": number(document_id),
        "Project": text(project.get("project_name")),
        "Overall Score": number_or_empty(review.get("overall_score")),
        "Decision": select(review.get("decision")),
        "Summary": text(review.get("summary")),
        "Analyst Reviews": text(format_json(review.get("analyst_reviews"))),
        "Red Team": text(review.get("red_team")),
        "Key Questions": text(join_list(review.get("key_questions"))),
        "Missing Info": text(join_list(review.get("missing_info"))),
        "Next Steps": text(join_list(review.get("next_steps"))),
        "Updated At": date(review.get("updated_at")),
    }
    upsert_page(conn, client, "committee", str(document_id), database_id, properties, dry_run)


def sync_activity(
    conn: sqlite3.Connection,
    client: NotionClient,
    database_id: str,
    log: dict[str, Any],
    dry_run: bool,
) -> None:
    log_id = int(log["id"])
    properties = {
        "Event": title(f"{log.get('action') or 'Activity'} #{log_id}"),
        "Log ID": number(log_id),
        "Actor": text(log.get("actor")),
        "Action": select(log.get("action")),
        "BP ID": number_or_empty(log.get("document_id")),
        "File": text(log.get("file_name")),
        "Detail": text(log.get("detail")),
        "Time": date(log.get("created_at")),
    }
    upsert_page(conn, client, "activity", str(log_id), database_id, properties, dry_run)


def upsert_page(
    conn: sqlite3.Connection,
    client: NotionClient,
    kind: str,
    local_id: str,
    database_id: str,
    properties: dict[str, Any],
    dry_run: bool,
) -> None:
    row = conn.execute(
        "SELECT notion_page_id FROM notion_sync_state WHERE kind = ? AND local_id = ?",
        (kind, local_id),
    ).fetchone()
    page_id = str(row["notion_page_id"]) if row else ""
    if dry_run:
        action = "update" if page_id else "create"
        print(f"[dry-run] {action} {kind}:{local_id}")
        return
    try:
        if page_id:
            client.update_page(page_id, properties)
        else:
            page_id = client.create_page(database_id, properties)
        conn.execute(
            """
            INSERT INTO notion_sync_state(kind, local_id, notion_page_id, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(kind, local_id) DO UPDATE SET
              notion_page_id = excluded.notion_page_id,
              updated_at = CURRENT_TIMESTAMP
            """,
            (kind, local_id, page_id),
        )
        print(f"Synced {kind}:{local_id}")
    except RuntimeError as exc:
        if page_id and "404" in str(exc):
            conn.execute("DELETE FROM notion_sync_state WHERE kind = ? AND local_id = ?", (kind, local_id))
            new_page_id = client.create_page(database_id, properties)
            conn.execute(
                "INSERT INTO notion_sync_state(kind, local_id, notion_page_id) VALUES (?, ?, ?)",
                (kind, local_id, new_page_id),
            )
            print(f"Recreated {kind}:{local_id}")
            return
        raise


def title(value: Any) -> dict[str, Any]:
    return {"title": [{"type": "text", "text": {"content": truncate(str(value or "Untitled"), 2000)}}]}


def text(value: Any) -> dict[str, Any]:
    content = truncate(str(value or ""), 2000)
    return {"rich_text": [{"type": "text", "text": {"content": content}}] if content else []}


def select(value: Any) -> dict[str, Any]:
    name = truncate_option(str(value or "").strip())
    return {"select": {"name": name}} if name else {"select": None}


def multi_select(value: Any) -> dict[str, Any]:
    values = value if isinstance(value, list) else [value] if value else []
    names = [truncate_option(str(item).strip()) for item in values if str(item or "").strip()]
    return {"multi_select": [{"name": name} for name in names[:20]]}


def checkbox(value: Any) -> dict[str, Any]:
    return {"checkbox": bool(value)}


def number(value: int | float) -> dict[str, Any]:
    return {"number": value}


def number_or_empty(value: Any) -> dict[str, Any]:
    if value in (None, ""):
        return {"number": None}
    try:
        return {"number": int(value)}
    except (TypeError, ValueError):
        return {"number": None}


def date(value: Any) -> dict[str, Any]:
    if not value:
        return {"date": None}
    text_value = str(value).strip().replace(" ", "T")
    if len(text_value) == 10:
        start = text_value
    else:
        start = text_value.rstrip("Z")
    return {"date": {"start": start}}


def join_list(value: Any) -> str:
    if isinstance(value, list):
        return "\n".join(f"- {item}" for item in value if str(item or "").strip())
    return str(value or "")


def format_evidence(value: Any) -> str:
    if not isinstance(value, list):
        return ""
    lines = []
    for item in value[:12]:
        if not isinstance(item, dict):
            continue
        page = item.get("page") or "?"
        field = item.get("field") or "Evidence"
        quote = item.get("quote") or ""
        lines.append(f"- p.{page} {field}: {quote}")
    return "\n".join(lines)


def format_json(value: Any) -> str:
    return json.dumps(value or [], ensure_ascii=False, indent=2)


def truncate(value: str, limit: int) -> str:
    return value if len(value) <= limit else value[: limit - 1] + "..."


def truncate_option(value: str) -> str:
    return truncate(value, 100)


def normalize_uuid(value: str) -> str:
    return value.strip().replace("-", "")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Create and sync BP Screener data to Notion.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("setup", help="Create Notion databases under NOTION_PARENT_PAGE_ID.")
    sync_parser = subparsers.add_parser("sync", help="Sync local BP data to Notion.")
    sync_parser.add_argument("--limit", type=int, default=None, help="Limit project/log rows for testing.")
    sync_parser.add_argument("--dry-run", action="store_true", help="Print actions without writing to Notion.")
    return parser.parse_args()


def main() -> None:
    load_dotenv(ROOT / ".env")
    args = parse_args()
    token = os.getenv("NOTION_API_KEY", "").strip()
    if not token and not (args.command == "sync" and args.dry_run):
        raise SystemExit("Set NOTION_API_KEY in .env before using Notion sync.")

    conn = connect(DB_PATH)
    ensure_sync_tables(conn)
    client = NotionClient(token or "dry-run")

    if args.command == "setup":
        parent_page_id = os.getenv("NOTION_PARENT_PAGE_ID", "").strip()
        if not parent_page_id:
            raise SystemExit("Set NOTION_PARENT_PAGE_ID in .env before running setup.")
        created = setup_databases(conn, client, parent_page_id)
        print("Created Notion databases:")
        for key, value in created.items():
            print(f"  {key}: {value}")
        return

    if args.command == "sync":
        sync_all(conn, client, limit=args.limit, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
