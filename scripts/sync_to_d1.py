from __future__ import annotations

import argparse
import sqlite3
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LOCAL_DB = ROOT / "data" / "bp_screener.sqlite"
DEFAULT_SCHEMA = ROOT / "cloudflare" / "schema.sql"
DEFAULT_OUTPUT = ROOT / "data" / "d1_seed.sql"


def quote(value: object) -> str:
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, int):
        return str(value)
    text = str(value).replace("'", "''")
    return f"'{text}'"


def row_insert(table: str, columns: list[str], row: sqlite3.Row) -> str:
    values = ", ".join(quote(row[column]) for column in columns)
    return f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({values});"


def export_seed(local_db: Path, schema_path: Path, output_path: Path, max_chunks: int) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(local_db)
    conn.row_factory = sqlite3.Row

    document_columns = ["id", "file_name", "source_url", "file_size", "created_at", "updated_at"]
    project_columns = [
        "id",
        "document_id",
        "project_name",
        "company_name",
        "industry",
        "ai_related",
        "ai_category",
        "financing_stage",
        "business_model",
        "team_highlights",
        "traction",
        "customers_or_users",
        "revenue_or_financials",
        "one_line_summary",
        "recommendation",
        "risks",
        "tags",
        "evidence",
        "created_at",
        "updated_at",
    ]
    chunk_columns = ["id", "document_id", "page", "chunk_index", "content"]

    with output_path.open("w", encoding="utf-8") as handle:
        handle.write(schema_path.read_text(encoding="utf-8"))
        handle.write("\n\nBEGIN TRANSACTION;\n")

        for row in conn.execute(
            """
            SELECT
              id,
              file_name,
              NULL AS source_url,
              file_size,
              created_at,
              updated_at
            FROM documents
            WHERE status = 'done'
            ORDER BY id
            """
        ):
            handle.write(row_insert("documents", document_columns, row) + "\n")

        for row in conn.execute("SELECT * FROM projects ORDER BY id"):
            handle.write(row_insert("projects", project_columns, row) + "\n")

        for row in conn.execute(
            """
            SELECT id, document_id, page, chunk_index, content
            FROM chunks
            ORDER BY document_id, chunk_index
            LIMIT ?
            """,
            (max_chunks,),
        ):
            handle.write(row_insert("chunks", chunk_columns, row) + "\n")

        handle.write("COMMIT;\n")


def execute_seed(database_name: str, output_path: Path) -> None:
    subprocess.run(
        ["npx", "wrangler", "d1", "execute", database_name, "--remote", "--file", str(output_path)],
        check=True,
        cwd=ROOT,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Export local SQLite data into Cloudflare D1 SQL.")
    parser.add_argument("--local-db", type=Path, default=DEFAULT_LOCAL_DB)
    parser.add_argument("--schema", type=Path, default=DEFAULT_SCHEMA)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--max-chunks", type=int, default=5000)
    parser.add_argument("--execute", action="store_true", help="Run wrangler d1 execute after exporting.")
    parser.add_argument("--database", default="bp-screener", help="Cloudflare D1 database name.")
    args = parser.parse_args()

    export_seed(args.local_db, args.schema, args.output, args.max_chunks)
    print(f"Exported D1 seed SQL to {args.output}")

    if args.execute:
        execute_seed(args.database, args.output)


if __name__ == "__main__":
    main()
