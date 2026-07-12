from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from .config import DB_PATH
from .embeddings import EMBEDDING_DIM, embed_text, pack_vector
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
  deleted_at TEXT,
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

CREATE TABLE IF NOT EXISTS project_translations (
  document_id INTEGER PRIMARY KEY,
  lang TEXT NOT NULL DEFAULT 'en',
  profile_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS project_reviews (
  document_id INTEGER PRIMARY KEY,
  review_status TEXT NOT NULL DEFAULT '待看',
  owner TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS committee_reviews (
  document_id INTEGER PRIMARY KEY,
  overall_score INTEGER NOT NULL DEFAULT 0,
  decision TEXT NOT NULL DEFAULT '',
  review_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor TEXT NOT NULL DEFAULT 'Unknown',
  action TEXT NOT NULL,
  document_id INTEGER,
  file_name TEXT NOT NULL DEFAULT '',
  detail TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  content,
  file_name UNINDEXED,
  page UNINDEXED,
  document_id UNINDEXED,
  chunk_id UNINDEXED,
  tokenize='unicode61'
);

CREATE TABLE IF NOT EXISTS chunk_embeddings (
  chunk_id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  dim INTEGER NOT NULL,
  vector BLOB NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(chunk_id) REFERENCES chunks(id),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_documents_status_updated ON documents(status, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_industry ON projects(industry);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON projects(financing_stage);
CREATE INDEX IF NOT EXISTS idx_projects_recommendation ON projects(recommendation);
CREATE INDEX IF NOT EXISTS idx_projects_ai_related ON projects(ai_related);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id, chunk_index);
CREATE INDEX IF NOT EXISTS idx_chunk_embeddings_document ON chunk_embeddings(document_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
"""


def connect(db_path: Path = DB_PATH) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    migrate_schema(conn)
    return conn


def migrate_schema(conn: sqlite3.Connection) -> None:
    columns = {
        row["name"]
        for row in conn.execute("PRAGMA table_info(documents)").fetchall()
    }
    if "deleted_at" not in columns:
        conn.execute("ALTER TABLE documents ADD COLUMN deleted_at TEXT")
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_documents_deleted_updated ON documents(deleted_at, updated_at DESC)"
    )


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
          deleted_at=NULL,
          updated_at=CURRENT_TIMESTAMP
        """,
        (file_path.name, str(file_path), stat.st_size),
    )
    row = conn.execute(
        "SELECT id FROM documents WHERE file_path = ?",
        (str(file_path),),
    ).fetchone()
    return int(row["id"])


def get_document_for_path(conn: sqlite3.Connection, file_path: Path) -> dict[str, Any] | None:
    row = conn.execute(
        """
        SELECT id, file_name, file_path, file_size, status, error, deleted_at, updated_at
        FROM documents
        WHERE file_path = ?
        """,
        (str(file_path),),
    ).fetchone()
    return dict(row) if row else None


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
        conn.execute(f"DELETE FROM chunk_embeddings WHERE chunk_id IN ({placeholders})", old_ids)
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
        conn.execute(
            """
            INSERT INTO chunk_embeddings(chunk_id, document_id, dim, vector, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            """,
            (chunk_id, document_id, EMBEDDING_DIM, pack_vector(embed_text(content))),
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
        WHERE d.deleted_at IS NULL
        ORDER BY p.updated_at DESC
        """
    ).fetchall()
    return [normalize_project_row(dict(row)) for row in rows]


def document_rows(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT
          d.id,
          d.file_name,
          d.file_path,
          d.file_size,
          d.status,
          d.error,
          d.created_at,
          d.updated_at,
          p.project_name,
          p.industry,
          p.recommendation
        FROM documents d
        LEFT JOIN projects p ON p.document_id = d.id
        WHERE d.deleted_at IS NULL
        ORDER BY d.updated_at DESC, d.id DESC
        """
    ).fetchall()
    return [dict(row) for row in rows]


def deleted_document_rows(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT
          d.id,
          d.file_name,
          d.file_path,
          d.file_size,
          d.status,
          d.error,
          d.deleted_at,
          d.created_at,
          d.updated_at,
          p.project_name,
          p.industry,
          p.recommendation
        FROM documents d
        LEFT JOIN projects p ON p.document_id = d.id
        WHERE d.deleted_at IS NOT NULL
        ORDER BY d.deleted_at DESC, d.id DESC
        """
    ).fetchall()
    return [dict(row) for row in rows]


def restore_document(conn: sqlite3.Connection, document_id: int) -> None:
    conn.execute(
        """
        UPDATE documents
        SET deleted_at = NULL,
            status = CASE WHEN status = 'deleted' THEN 'done' ELSE status END,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (document_id,),
    )


def document_stats(conn: sqlite3.Connection) -> dict[str, int]:
    rows = conn.execute(
        """
        SELECT status, COUNT(*) AS count
        FROM documents
        WHERE deleted_at IS NULL
        GROUP BY status
        """
    ).fetchall()
    stats = {"total": 0, "done": 0, "failed": 0, "processing": 0, "new": 0}
    for row in rows:
        status = row["status"] or "new"
        count = int(row["count"])
        stats[status] = count
        stats["total"] += count
    return stats


def get_project_translation(conn: sqlite3.Connection, document_id: int, lang: str = "en") -> dict[str, Any] | None:
    row = conn.execute(
        """
        SELECT profile_json
        FROM project_translations
        WHERE document_id = ? AND lang = ?
        """,
        (document_id, lang),
    ).fetchone()
    return loads(row["profile_json"]) if row else None


def save_project_translation(
    conn: sqlite3.Connection,
    document_id: int,
    profile: dict[str, Any],
    lang: str = "en",
) -> None:
    conn.execute(
        """
        INSERT INTO project_translations(document_id, lang, profile_json, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(document_id) DO UPDATE SET
          lang=excluded.lang,
          profile_json=excluded.profile_json,
          updated_at=CURRENT_TIMESTAMP
        """,
        (document_id, lang, dumps(profile)),
    )


def get_project_review(conn: sqlite3.Connection, document_id: int) -> dict[str, Any]:
    row = conn.execute(
        """
        SELECT review_status, owner, note, updated_at
        FROM project_reviews
        WHERE document_id = ?
        """,
        (document_id,),
    ).fetchone()
    if row:
        return dict(row)
    return {"review_status": "待看", "owner": "", "note": "", "updated_at": ""}


def save_project_review(
    conn: sqlite3.Connection,
    document_id: int,
    review_status: str,
    owner: str,
    note: str,
) -> None:
    conn.execute(
        """
        INSERT INTO project_reviews(document_id, review_status, owner, note, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(document_id) DO UPDATE SET
          review_status=excluded.review_status,
          owner=excluded.owner,
          note=excluded.note,
          updated_at=CURRENT_TIMESTAMP
        """,
        (document_id, review_status, owner, note),
    )


def get_committee_review(conn: sqlite3.Connection, document_id: int) -> dict[str, Any] | None:
    row = conn.execute(
        """
        SELECT overall_score, decision, review_json, updated_at
        FROM committee_reviews
        WHERE document_id = ?
        """,
        (document_id,),
    ).fetchone()
    if not row:
        return None
    review = loads(row["review_json"]) or {}
    review["overall_score"] = int(row["overall_score"] or review.get("overall_score") or 0)
    review["decision"] = row["decision"] or review.get("decision") or ""
    review["updated_at"] = row["updated_at"]
    return review


def save_committee_review(conn: sqlite3.Connection, document_id: int, review: dict[str, Any]) -> None:
    overall_score = int(review.get("overall_score") or 0)
    decision = str(review.get("decision") or "")
    conn.execute(
        """
        INSERT INTO committee_reviews(document_id, overall_score, decision, review_json, updated_at)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(document_id) DO UPDATE SET
          overall_score=excluded.overall_score,
          decision=excluded.decision,
          review_json=excluded.review_json,
          updated_at=CURRENT_TIMESTAMP
        """,
        (document_id, overall_score, decision, dumps(review)),
    )


def log_activity(
    conn: sqlite3.Connection,
    actor: str,
    action: str,
    document_id: int | None = None,
    file_name: str = "",
    detail: str = "",
) -> None:
    conn.execute(
        """
        INSERT INTO activity_logs(actor, action, document_id, file_name, detail)
        VALUES (?, ?, ?, ?, ?)
        """,
        (actor.strip() or "Unknown", action, document_id, file_name, detail),
    )


def activity_rows(conn: sqlite3.Connection, limit: int = 200) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT id, actor, action, document_id, file_name, detail, created_at
        FROM activity_logs
        ORDER BY id DESC
        LIMIT ?
        """,
        (limit,),
    ).fetchall()
    return [dict(row) for row in rows]


def delete_document(conn: sqlite3.Connection, document_id: int) -> None:
    conn.execute(
        """
        UPDATE documents
        SET deleted_at = CURRENT_TIMESTAMP,
            status = 'deleted',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """,
        (document_id,),
    )


def normalize_project_row(row: dict[str, Any]) -> dict[str, Any]:
    for key in ["ai_category", "team_highlights", "traction", "risks", "tags", "evidence"]:
        row[key] = loads(row.get(key, "[]")) or []
    row["ai_related"] = bool(row.get("ai_related"))
    return row

