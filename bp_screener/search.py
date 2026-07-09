from __future__ import annotations

import re
import sqlite3
from typing import Any

from .db import normalize_project_row, project_rows


def list_projects(
    conn: sqlite3.Connection,
    industry: str = "",
    stage: str = "",
    recommendation: str = "",
    ai_only: bool = False,
) -> list[dict[str, Any]]:
    rows = project_rows(conn)
    if industry:
        rows = [row for row in rows if industry.lower() in row["industry"].lower()]
    if stage:
        rows = [row for row in rows if stage.lower() in row["financing_stage"].lower()]
    if recommendation:
        rows = [row for row in rows if row["recommendation"] == recommendation]
    if ai_only:
        rows = [row for row in rows if row["ai_related"]]
    return rows


def search_chunks(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict[str, Any]]:
    if not query.strip():
        return []
    fts_query = build_fts_query(query)
    rows = conn.execute(
        """
        SELECT
          document_id,
          file_name,
          page,
          snippet(chunks_fts, 0, '[', ']', '...', 12) AS snippet,
          bm25(chunks_fts) AS score
        FROM chunks_fts
        WHERE chunks_fts MATCH ?
        ORDER BY score
        LIMIT ?
        """,
        (fts_query, limit),
    ).fetchall()
    return [dict(row) for row in rows]


def build_fts_query(query: str) -> str:
    terms = re.findall(r"[\w\u4e00-\u9fff]+", query)
    if not terms:
        return query
    return " OR ".join(terms)


def get_project(conn: sqlite3.Connection, document_id: int) -> dict[str, Any] | None:
    row = conn.execute(
        """
        SELECT p.*, d.file_name, d.file_path
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        WHERE p.document_id = ?
        """,
        (document_id,),
    ).fetchone()
    return normalize_project_row(dict(row)) if row else None

