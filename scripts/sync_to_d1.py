from __future__ import annotations

import argparse
import shutil
import sqlite3
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from bp_screener.db import migrate_schema

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
    return f"INSERT OR REPLACE INTO {table} ({', '.join(columns)}) VALUES ({values});"


def row_upsert(table: str, columns: list[str], conflict_columns: list[str], row: sqlite3.Row) -> str:
    values = ", ".join(quote(row[column]) for column in columns)
    conflict = ", ".join(conflict_columns)
    update_columns = [column for column in columns if column not in conflict_columns]
    updates = ", ".join(f"{column}=excluded.{column}" for column in update_columns)
    return (
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({values}) "
        f"ON CONFLICT({conflict}) DO UPDATE SET {updates};"
    )


def object_key(document_id: int, file_name: str) -> str:
    safe_name = file_name.replace("\\", "_").replace("/", "_").strip()
    return f"documents/{document_id}/{safe_name}"


def export_seed(
    local_db: Path,
    schema_path: Path,
    output_path: Path,
    max_chunks: int,
    include_transaction: bool = False,
    include_file_keys: bool = False,
    include_schema: bool = False,
    allow_drop: bool = False,
    document_id: int | None = None,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(local_db)
    conn.row_factory = sqlite3.Row
    migrate_schema(conn)

    document_columns = [
        "id",
        "file_name",
        "source_url",
        "file_size",
        "source_platform",
        "source_external_id",
        "status",
        "created_at",
        "updated_at",
    ]
    project_columns = [
        "id",
        "document_id",
        "project_name",
        "company_name",
        "industry",
        "country_or_region",
        "ai_related",
        "ai_category",
        "financing_stage",
        "business_model",
        "customer_type",
        "revenue_stage",
        "team_highlights",
        "traction",
        "customers_or_users",
        "revenue_or_financials",
        "one_line_summary",
        "recommendation",
        "screening_score",
        "team_score",
        "traction_score",
        "risk_level",
        "risks",
        "tags",
        "evidence",
        "created_at",
        "updated_at",
    ]
    chunk_columns = ["id", "document_id", "page", "chunk_index", "content"]
    if document_id is not None:
        project_columns = [column for column in project_columns if column != "id"]
        chunk_columns = ["document_id", "page", "chunk_index", "content"]
    translation_columns = ["document_id", "lang", "profile_json", "created_at", "updated_at"]
    weight_factor_columns = [
        "id",
        "key",
        "name",
        "description",
        "category",
        "scope",
        "owner",
        "created_at",
        "updated_at",
        "source_prompt",
        "metadata_json",
    ]

    with output_path.open("w", encoding="utf-8") as handle:
        if include_schema:
            schema_sql = schema_path.read_text(encoding="utf-8")
            if "DROP TABLE" in schema_sql.upper() and not allow_drop:
                schema_sql = "\n".join(
                    line for line in schema_sql.splitlines() if not line.lstrip().upper().startswith("DROP TABLE")
                )
            handle.write(schema_sql.rstrip() + "\n\n")
        if include_transaction:
            handle.write("\n\nBEGIN TRANSACTION;\n")

        if document_id is not None:
            handle.write(f"DELETE FROM chunks WHERE document_id = {int(document_id)};\n")

        document_where = "WHERE status = 'done'"
        document_params: tuple[object, ...] = ()
        if document_id is not None:
            document_where += " AND id = ?"
            document_params = (int(document_id),)

        for row in conn.execute(
            f"""
            SELECT
              id,
              file_name,
              file_path,
              source_url,
              file_size,
              source_platform,
              source_external_id,
              status,
              created_at,
              updated_at
            FROM documents
            {document_where}
            ORDER BY id
            """,
            document_params,
        ):
            payload = dict(row)
            payload["source_url"] = payload.get("source_url") or (
                object_key(payload["id"], payload["file_name"]) if include_file_keys else None
            )
            if document_id is not None:
                handle.write(row_upsert("documents", document_columns, ["id"], payload) + "\n")
            else:
                handle.write(row_insert("documents", document_columns, payload) + "\n")

        project_where = "WHERE document_id = ?" if document_id is not None else ""
        project_params = (int(document_id),) if document_id is not None else ()
        for row in conn.execute(f"SELECT * FROM projects {project_where} ORDER BY id", project_params):
            if document_id is not None:
                handle.write(row_upsert("projects", project_columns, ["document_id"], row) + "\n")
            else:
                handle.write(row_insert("projects", project_columns, row) + "\n")

        chunk_where = "WHERE document_id = ?" if document_id is not None else ""
        chunk_limit = "" if document_id is not None else "LIMIT ?"
        chunk_params: tuple[object, ...] = (int(document_id),) if document_id is not None else (max_chunks,)
        for row in conn.execute(
            f"""
            SELECT {', '.join(chunk_columns)}
            FROM chunks
            {chunk_where}
            ORDER BY document_id, chunk_index
            {chunk_limit}
            """,
            chunk_params,
        ):
            handle.write(row_insert("chunks", chunk_columns, row) + "\n")

        translation_where = "WHERE document_id = ?" if document_id is not None else ""
        translation_params = (int(document_id),) if document_id is not None else ()
        for row in conn.execute(
            f"""
            SELECT document_id, lang, profile_json, created_at, updated_at
            FROM project_translations
            {translation_where}
            ORDER BY document_id, lang
            """,
            translation_params,
        ):
            if document_id is not None:
                handle.write(row_upsert("project_translations", translation_columns, ["document_id", "lang"], row) + "\n")
            else:
                handle.write(row_insert("project_translations", translation_columns, row) + "\n")

        if document_id is None:
            for row in conn.execute(
                """
                SELECT id, key, name, description, category, scope, owner,
                       created_at, updated_at, source_prompt, metadata_json
                FROM weight_factors
                ORDER BY id
                """
            ):
                handle.write(row_insert("weight_factors", weight_factor_columns, row) + "\n")

        if include_transaction:
            handle.write("COMMIT;\n")


def execute_seed(database_name: str, output_path: Path, remote: bool = True) -> None:
    npx = shutil.which("npx.cmd") or shutil.which("npx")
    if not npx:
        raise SystemExit("npx was not found on PATH. Install Node.js/npm or run Wrangler directly.")
    command = [npx, "wrangler", "d1", "execute", database_name, "--file", str(output_path)]
    command.append("--remote" if remote else "--local")
    subprocess.run(
        command,
        check=True,
        cwd=ROOT,
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Export local SQLite data into Cloudflare D1 SQL.")
    parser.add_argument("--local-db", type=Path, default=DEFAULT_LOCAL_DB)
    parser.add_argument("--schema", type=Path, default=DEFAULT_SCHEMA)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--max-chunks", type=int, default=5000)
    parser.add_argument("--include-transaction", action="store_true")
    parser.add_argument("--include-file-keys", action="store_true", help="Write deterministic R2 object keys into source_url.")
    parser.add_argument("--include-schema", action="store_true", help="Include schema DDL without DROP TABLE lines.")
    parser.add_argument("--reset-schema", action="store_true", help="Include the full schema file, including destructive DROP TABLE lines.")
    parser.add_argument("--allow-drop", action="store_true", help="Required with --reset-schema and --execute to run DROP TABLE statements.")
    parser.add_argument("--execute", action="store_true", help="Run wrangler d1 execute after exporting.")
    parser.add_argument("--local", action="store_true", help="Execute against local Wrangler D1 when used with --execute.")
    parser.add_argument("--document-id", type=int, help="Export only one parsed document and its project/chunks/translations.")
    parser.add_argument("--database", default="bp-screener", help="Cloudflare D1 database name.")
    args = parser.parse_args()
    if args.reset_schema and not args.allow_drop:
        parser.error("--reset-schema is destructive and requires --allow-drop.")

    export_seed(
        args.local_db,
        args.schema,
        args.output,
        args.max_chunks,
        args.include_transaction,
        args.include_file_keys,
        include_schema=args.include_schema or args.reset_schema,
        allow_drop=args.allow_drop and args.reset_schema,
        document_id=args.document_id,
    )
    print(f"Exported D1 seed SQL to {args.output}")

    if args.execute:
        output_sql = args.output.read_text(encoding="utf-8")
        if "DROP TABLE" in output_sql.upper() and not args.allow_drop:
            raise SystemExit("Refusing to execute SQL containing DROP TABLE without --allow-drop.")
        execute_seed(args.database, args.output, remote=not args.local)


if __name__ == "__main__":
    main()
