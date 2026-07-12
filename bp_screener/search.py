from __future__ import annotations

import re
import sqlite3
from typing import Any

from .db import normalize_project_row
from .embeddings import cosine_packed, embed_text


PROJECT_LIST_SELECT = """
SELECT
  p.*,
  d.file_name,
  d.file_path,
  COALESCE(r.review_status, '待看') AS review_status,
  COALESCE(r.owner, '') AS owner,
  COALESCE(c.overall_score, '') AS committee_score,
  COALESCE(c.decision, '') AS committee_decision
FROM projects p
JOIN documents d ON d.id = p.document_id
LEFT JOIN project_reviews r ON r.document_id = p.document_id
LEFT JOIN committee_reviews c ON c.document_id = p.document_id
"""


def project_filter_clause(
    industry: str = "",
    stage: str = "",
    recommendation: str = "",
    ai_only: bool = False,
) -> tuple[str, list[Any]]:
    clauses: list[str] = ["d.deleted_at IS NULL"]
    params: list[Any] = []
    if industry:
        clauses.append("LOWER(p.industry) LIKE ?")
        params.append(f"%{industry.lower()}%")
    if stage:
        clauses.append("LOWER(p.financing_stage) LIKE ?")
        params.append(f"%{stage.lower()}%")
    if recommendation:
        clauses.append("p.recommendation = ?")
        params.append(recommendation)
    if ai_only:
        clauses.append("p.ai_related = 1")
    return " WHERE " + " AND ".join(clauses), params


def list_projects(
    conn: sqlite3.Connection,
    industry: str = "",
    stage: str = "",
    recommendation: str = "",
    ai_only: bool = False,
) -> list[dict[str, Any]]:
    return list_projects_page(
        conn,
        industry=industry,
        stage=stage,
        recommendation=recommendation,
        ai_only=ai_only,
        limit=None,
        offset=0,
    )


def list_projects_page(
    conn: sqlite3.Connection,
    industry: str = "",
    stage: str = "",
    recommendation: str = "",
    ai_only: bool = False,
    limit: int | None = 50,
    offset: int = 0,
) -> list[dict[str, Any]]:
    where_sql, params = project_filter_clause(industry, stage, recommendation, ai_only)
    limit_sql = ""
    if limit is not None:
        limit_sql = " LIMIT ? OFFSET ?"
        params.extend([int(limit), int(offset)])
    rows = conn.execute(
        f"""
        {PROJECT_LIST_SELECT}
        {where_sql}
        ORDER BY p.updated_at DESC, p.document_id DESC
        {limit_sql}
        """,
        params,
    ).fetchall()
    return [normalize_project_row(dict(row)) for row in rows]


def count_projects(
    conn: sqlite3.Connection,
    industry: str = "",
    stage: str = "",
    recommendation: str = "",
    ai_only: bool = False,
) -> int:
    where_sql, params = project_filter_clause(industry, stage, recommendation, ai_only)
    row = conn.execute(
        f"""
        SELECT COUNT(*) AS count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        {where_sql}
        """,
        params,
    ).fetchone()
    return int(row["count"] or 0)


def project_metric_counts(conn: sqlite3.Connection) -> dict[str, int]:
    row = conn.execute(
        """
        SELECT
          COUNT(*) AS project_count,
          COUNT(DISTINCT NULLIF(TRIM(p.industry), '')) AS industry_count,
          SUM(CASE WHEN p.ai_related = 1 THEN 1 ELSE 0 END) AS ai_count,
          SUM(CASE WHEN c.document_id IS NOT NULL THEN 1 ELSE 0 END) AS reviewed_count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        LEFT JOIN committee_reviews c ON c.document_id = p.document_id
        WHERE d.deleted_at IS NULL
        """
    ).fetchone()
    return {
        "project_count": int(row["project_count"] or 0),
        "industry_count": int(row["industry_count"] or 0),
        "ai_count": int(row["ai_count"] or 0),
        "reviewed_count": int(row["reviewed_count"] or 0),
    }


def count_by_field(conn: sqlite3.Connection, field: str, top_n: int = 12) -> list[dict[str, Any]]:
    allowed_fields = {
        "industry": "p.industry",
        "financing_stage": "p.financing_stage",
        "recommendation": "p.recommendation",
    }
    if field not in allowed_fields:
        raise ValueError(f"Unsupported count field: {field}")
    column = allowed_fields[field]
    rows = conn.execute(
        f"""
        SELECT COALESCE(NULLIF(TRIM({column}), ''), 'Unknown') AS category,
               COUNT(*) AS count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        WHERE d.deleted_at IS NULL
        GROUP BY category
        ORDER BY count DESC, category ASC
        LIMIT ?
        """,
        (int(top_n),),
    ).fetchall()
    return [dict(row) for row in rows]


def ai_relevance_counts(conn: sqlite3.Connection) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT CASE WHEN p.ai_related = 1 THEN 'yes' ELSE 'no' END AS category,
               COUNT(*) AS count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        WHERE d.deleted_at IS NULL
        GROUP BY category
        ORDER BY count DESC
        """
    ).fetchall()
    return [dict(row) for row in rows]


def committee_decision_counts(conn: sqlite3.Connection, industry: str = "", top_n: int = 8) -> list[dict[str, Any]]:
    params: list[Any] = []
    industry_sql = ""
    if industry:
        industry_sql = " AND p.industry = ?"
        params.append(industry)
    params.append(int(top_n))
    rows = conn.execute(
        f"""
        SELECT COALESCE(NULLIF(TRIM(c.decision), ''), 'Not reviewed') AS category,
               COUNT(*) AS count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        LEFT JOIN committee_reviews c ON c.document_id = p.document_id
        WHERE d.deleted_at IS NULL
        {industry_sql}
        GROUP BY category
        ORDER BY count DESC, category ASC
        LIMIT ?
        """,
        params,
    ).fetchall()
    return [dict(row) for row in rows]


def committee_score_band_counts(conn: sqlite3.Connection, top_n: int = 8) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT
          CASE
            WHEN c.document_id IS NULL THEN 'Not reviewed'
            WHEN c.overall_score >= 80 THEN '80-100'
            WHEN c.overall_score >= 60 THEN '60-79'
            WHEN c.overall_score >= 40 THEN '40-59'
            WHEN c.overall_score >= 20 THEN '20-39'
            ELSE '0-19'
          END AS category,
          COUNT(*) AS count
        FROM projects p
        JOIN documents d ON d.id = p.document_id
        LEFT JOIN committee_reviews c ON c.document_id = p.document_id
        WHERE d.deleted_at IS NULL
        GROUP BY category
        ORDER BY count DESC, category ASC
        LIMIT ?
        """,
        (int(top_n),),
    ).fetchall()
    return [dict(row) for row in rows]


def search_chunks(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict[str, Any]]:
    if not query.strip():
        return []
    fts_query = build_fts_query(query)
    rows = conn.execute(
        """
        SELECT
          chunks_fts.document_id,
          chunks_fts.file_name,
          chunks_fts.page,
          snippet(chunks_fts, 0, '[', ']', '...', 12) AS snippet,
          bm25(chunks_fts) AS score
        FROM chunks_fts
        JOIN documents d ON d.id = chunks_fts.document_id
        WHERE chunks_fts MATCH ?
          AND d.deleted_at IS NULL
        ORDER BY score
        LIMIT ?
        """,
        (fts_query, limit),
    ).fetchall()
    return [dict(row) for row in rows]


def semantic_search_chunks(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict[str, Any]]:
    if not query.strip():
        return []
    query_vector = embed_text(query)
    rows = conn.execute(
        """
        SELECT
          c.document_id,
          d.file_name,
          c.page,
          c.content,
          e.vector
        FROM chunk_embeddings e
        JOIN chunks c ON c.id = e.chunk_id
        JOIN documents d ON d.id = c.document_id
        WHERE d.deleted_at IS NULL
        """
    ).fetchall()
    scored = []
    for row in rows:
        score = cosine_packed(query_vector, row["vector"])
        if score <= 0:
            continue
        content = str(row["content"] or "")
        scored.append(
            {
                "document_id": row["document_id"],
                "file_name": row["file_name"],
                "page": row["page"],
                "snippet": content[:360],
                "score": score,
                "match_type": "semantic",
            }
        )
    scored.sort(key=lambda item: item["score"], reverse=True)
    return scored[:limit]


def hybrid_search_chunks(conn: sqlite3.Connection, query: str, limit: int = 20) -> list[dict[str, Any]]:
    keyword_rows = search_chunks(conn, query, limit=limit)
    semantic_rows = semantic_search_chunks(conn, query, limit=limit)
    merged: dict[tuple[int, int | None, str], dict[str, Any]] = {}
    for rank, row in enumerate(keyword_rows):
        key = (int(row["document_id"]), row.get("page"), str(row.get("snippet", ""))[:80])
        merged[key] = {
            **row,
            "score": 1.0 / (rank + 1),
            "match_type": "keyword",
        }
    for rank, row in enumerate(semantic_rows):
        key = (int(row["document_id"]), row.get("page"), str(row.get("snippet", ""))[:80])
        if key in merged:
            merged[key]["score"] = float(merged[key].get("score") or 0) + float(row.get("score") or 0)
            merged[key]["match_type"] = "hybrid"
        else:
            merged[key] = {
                **row,
                "score": float(row.get("score") or 0) * (1.0 - rank / max(limit, 1) * 0.2),
            }
    results = list(merged.values())
    results.sort(key=lambda item: float(item.get("score") or 0), reverse=True)
    return results[:limit]


def similar_projects(conn: sqlite3.Connection, document_id: int, limit: int = 6) -> list[dict[str, Any]]:
    project = get_project(conn, document_id)
    if not project:
        return []
    query = " ".join(
        [
            str(project.get("project_name") or ""),
            str(project.get("industry") or ""),
            str(project.get("ai_category") or ""),
            str(project.get("business_model") or ""),
            str(project.get("one_line_summary") or ""),
            " ".join(str(item) for item in project.get("tags") or []),
        ]
    ).strip()
    if not query:
        return []
    candidates = semantic_search_chunks(conn, query, limit=120)
    scores: dict[int, float] = {}
    for item in candidates:
        candidate_id = int(item["document_id"])
        if candidate_id == int(document_id):
            continue
        scores[candidate_id] = max(scores.get(candidate_id, 0.0), float(item.get("score") or 0.0))
    ranked_ids = sorted(scores, key=scores.get, reverse=True)[:limit]
    results = []
    for candidate_id in ranked_ids:
        candidate = get_project(conn, candidate_id)
        if candidate:
            candidate["similarity_score"] = scores[candidate_id]
            results.append(candidate)
    return results


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
          AND d.deleted_at IS NULL
        """,
        (document_id,),
    ).fetchone()
    return normalize_project_row(dict(row)) if row else None


def get_project_chunks(conn: sqlite3.Connection, document_id: int, limit: int = 12) -> list[dict[str, Any]]:
    rows = conn.execute(
        """
        SELECT page, chunk_index, content
        FROM chunks
        WHERE document_id = ?
        ORDER BY chunk_index ASC
        LIMIT ?
        """,
        (document_id, limit),
    ).fetchall()
    return [dict(row) for row in rows]

