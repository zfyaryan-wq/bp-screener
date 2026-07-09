from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from .config import DB_PATH
from .models import ProjectProfile


SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  file_size INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  ai_related INTEGER NOT NULL DEFAULT 0,
  ai_category TEXT NOT NULL DEFAULT '[]',
  financing_stage TEXT NOT NULL,
  business_model TEXT NOT NULL,
  team_highlights TEXT NOT NULL DEFAULT '[]',
  traction TEXT NOT NULL DEFAULT '[]',
  customers_or_users TEXT NOT NULL,
  revenue_or_financials TEXT NOT NULL,
  one_line_summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  risks TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  evidence TEXT NOT NULL DEFAULT '[]',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS chunks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  document_id INTEGER NOT NULL,
  page INTEGER,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  content,
  file_name UNINDEXED,
  page UNINDEXED,
  document_id UNINDEXED,
  chunk_id UNINDEXED,
  tokenize='unicode61'
);
"""


def connect(db_path: Path = DB_PATH) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    return conn


def dumps(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def loads(value: str) -> Any:
    return json.loads(value) if value else None


def upsert_document(conn: sqlite3.Connection, file_path: Path) -> int:
    stat = file_path.stat()
    conn.execute(
        """
        INSERT INTO documents(file_name, file_path, file_size, status, updated_at)
        VALUES (?, ?, ?, 'processing', CURRENT_TIMESTAMP)
        ON CONFLICT(file_path) DO UPDATE SET
          file_name=excluded.file_name,
          file_size=excluded.file_size,
          status='processing',
          error=NULL,
          updated_at=CURRENT_TIMESTAMP
        """,
        (file_path.name, str(file_path), stat.st_size),
    )
    row = conn.execute(
        "SELECT id FROM documents WHERE file_path = ?",
        (str(file_path),),
    ).fetchone()
    return int(row["id"])


def replace_chunks(
    conn: sqlite3.Connection,
    document_id: int,
    file_name: str,
    chunks: list[tuple[int | None, int, str]],
) -> None:
    old_ids = [
        int(row["id"])
        for row in conn.execute("SELECT id FROM chunks WHERE document_id = ?", (document_id,))
    ]
    if old_ids:
        placeholders = ",".join("?" for _ in old_ids)
        conn.execute(f"DELETE FROM chunks_fts WHERE chunk_id IN ({placeholders})", old_ids)
    conn.execute("DELETE FROM chunks WHERE document_id = ?", (document_id,))

    for page, chunk_index, content in chunks:
        cursor = conn.execute(
            """
            INSERT INTO chunks(document_id, page, chunk_index, content)
            VALUES (?, ?, ?, ?)
            """,
            (document_id, page, chunk_index, content),
        )
        chunk_id = int(cursor.lastrowid)
        conn.execute(
            """
            INSERT INTO chunks_fts(content, file_name, page, document_id, chunk_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (content, file_name, page, document_id, chunk_id),
        )


def upsert_project(conn: sqlite3.Connection, document_id: int, profile: ProjectProfile) -> None:
    payload = profile.model_dump()
    conn.execute(
        """
        INSERT INTO projects(
          document_id, project_name, company_name, industry, ai_related, ai_category,
          financing_stage, business_model, team_highlights, traction, customers_or_users,
          revenue_or_financials, one_line_summary, recommendation, risks, tags, evidence,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(document_id) DO UPDATE SET
          project_name=excluded.project_name,
          company_name=excluded.company_name,
          industry=excluded.industry,
          ai_related=excluded.ai_related,
          ai_category=excluded.ai_category,
          financing_stage=excluded.financing_stage,
          business_model=excluded.business_model,
          team_highlights=excluded.team_highlights,
          traction=excluded.traction,
          customers_or_users=excluded.customers_or_users,
          revenue_or_financials=excluded.revenue_or_financials,
          one_line_summary=excluded.one_line_summary,
          recommendation=excluded.recommendation,
          risks=excluded.risks,
          tags=excluded.tags,
          evidence=excluded.evidence,
          updated_at=CURRENT_TIMESTAMP
        """,
        (
            document_id,
            payload["project_name"],
            payload["company_name"],
            payload["industry"],
            int(payload["ai_related"]),
            dumps(payload["ai_category"]),
            payload["financing_stage"],
            payload["business_model"],
            dumps(payload["team_highlights"]),
            dumps(payload["traction"]),
            payload["customers_or_users"],
            payload["revenue_or_financials"],
            payload["one_line_summary"],
            payload["recommendation"],
            dumps(payload["risks"]),
            dumps(payload["tags"]),
            dumps(payload["evidence"]),
        ),
    )
    conn.execute(
        "UPDATE documents SET status = 'done', error = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (document_id,),
    )


def mark_failed(conn: sqlite3.Connection, document_id: int, error: str) -> None:
    conn.execute(
        "UPDATE documents SET status = 'failed', error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (error[:1000], document_id),
    )


def project_rows(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT p.*, d.file_name, d.file_path
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        ORDER BY p.updated_at DESC
        """
    ).fetchall()
    return [normalize_project_row(dict(row)) for row in rows]


def normalize_project_row(row: dict[str, Any]) -> dict[str, Any]:
    for key in ["ai_category", "team_highlights", "traction", "risks", "tags", "evidence"]:
        row[key] = loads(row.get(key, "[]")) or []
    row["ai_related"] = bool(row.get("ai_related"))
    return row

