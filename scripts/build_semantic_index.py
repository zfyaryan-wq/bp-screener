from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from bp_screener.config import DB_PATH
from bp_screener.db import connect
from bp_screener.embeddings import EMBEDDING_DIM, embed_text, pack_vector


def build_index(limit: int | None = None, force: bool = False) -> int:
    with connect(DB_PATH) as conn:
        params: list[object] = []
        where = ""
        if not force:
            where = "WHERE e.chunk_id IS NULL"
        limit_sql = ""
        if limit is not None:
            limit_sql = " LIMIT ?"
            params.append(int(limit))
        rows = conn.execute(
            f"""
            SELECT c.id, c.document_id, c.content
            FROM chunks c
            LEFT JOIN chunk_embeddings e ON e.chunk_id = c.id
            {where}
            ORDER BY c.id ASC
            {limit_sql}
            """,
            params,
        ).fetchall()
        for row in rows:
            conn.execute(
                """
                INSERT INTO chunk_embeddings(chunk_id, document_id, dim, vector, updated_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
                ON CONFLICT(chunk_id) DO UPDATE SET
                  document_id = excluded.document_id,
                  dim = excluded.dim,
                  vector = excluded.vector,
                  updated_at = CURRENT_TIMESTAMP
                """,
                (
                    int(row["id"]),
                    int(row["document_id"]),
                    EMBEDDING_DIM,
                    pack_vector(embed_text(str(row["content"] or ""))),
                ),
            )
        conn.commit()
        return len(rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build local semantic search vectors for BP chunks.")
    parser.add_argument("--limit", type=int, default=None, help="Limit rows for testing.")
    parser.add_argument("--force", action="store_true", help="Rebuild existing embeddings.")
    args = parser.parse_args()
    count = build_index(limit=args.limit, force=args.force)
    print(f"Indexed {count} chunks.")


if __name__ == "__main__":
    main()
