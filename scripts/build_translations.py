from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from bp_screener.config import DB_PATH
from bp_screener.db import connect, get_project_translation, save_project_translation
from bp_screener.llm_client import chat_completion
from bp_screener.llm_json import loads_llm_json
from bp_screener.services.translation import translate_project_profile


LANGUAGES = {
    "en": "English",
    "zh": "Chinese",
}

JSON_FIELDS = {"ai_category", "team_highlights", "traction", "risks", "tags", "evidence"}


def get_project_chunks(conn, document_id: int) -> list[dict]:
    rows = conn.execute(
        """
        SELECT page, chunk_index, content
        FROM chunks
        WHERE document_id = ?
        ORDER BY chunk_index ASC
        LIMIT 20
        """,
        (document_id,),
    ).fetchall()
    return [dict(row) for row in rows]


def log(message: str) -> None:
    encoding = sys.stdout.encoding or "utf-8"
    safe_message = message.encode(encoding, errors="replace").decode(encoding, errors="replace")
    print(safe_message, flush=True)


def batched(items: list, size: int) -> list[list]:
    return [items[index : index + size] for index in range(0, len(items), size)]


def decode_json_field(value):
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        return value


def trim_evidence(value):
    evidence = decode_json_field(value)
    if not isinstance(evidence, list):
        return evidence
    trimmed = []
    for item in evidence[:8]:
        if isinstance(item, dict):
            copy = dict(item)
            if isinstance(copy.get("quote"), str):
                copy["quote"] = copy["quote"][:360]
            trimmed.append(copy)
        else:
            trimmed.append(item)
    return trimmed


def compact_project(row: dict) -> dict:
    fields = [
        "document_id",
        "project_name",
        "company_name",
        "industry",
        "country_or_region",
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
        "risk_level",
        "risks",
        "tags",
        "evidence",
    ]
    compact = {field: row.get(field) for field in fields}
    for field in JSON_FIELDS:
        if field in compact:
            compact[field] = trim_evidence(compact[field]) if field == "evidence" else decode_json_field(compact[field])
    return compact


def translate_batch(projects: list[dict], target_language: str) -> dict[int, dict]:
    response = chat_completion(
        messages=[
            {
                "role": "system",
                "content": (
                    "You translate BP screening profiles for a small international review team. "
                    f"Translate every user-facing string into clear, professional {target_language}. "
                    "Preserve JSON keys, document_id, booleans, and numeric values. Do not add facts. "
                    "Translate recommendation and risk_level too: English uses High/Medium/Low/Unknown; "
                    "Chinese uses 高/中/低/未知. Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Translate this array of project profiles. Return exactly this JSON shape:\n"
                    '{"items":[{"document_id":123,"profile":{...translated profile...}}]}\n\n'
                    f"Projects:\n{json.dumps(projects, ensure_ascii=False)}"
                ),
            },
        ],
        temperature=0.1,
        max_tokens=12000,
        response_format={"type": "json_object"},
    )
    payload = loads_llm_json(response.choices[0].message.content)
    result: dict[int, dict] = {}
    for item in payload.get("items", []):
        document_id = int(item.get("document_id") or 0)
        profile = item.get("profile") or {}
        if document_id and isinstance(profile, dict):
            result[document_id] = profile
    return result


def build_translations(db_path: Path, limit: int | None = None, force: bool = False, batch_size: int = 8) -> None:
    with connect(db_path) as conn:
        rows = conn.execute(
            """
            SELECT p.*, d.file_name, d.source_url
            FROM projects p
            JOIN documents d ON d.id = p.document_id
            ORDER BY p.updated_at DESC, p.id DESC
            """
        ).fetchall()
        if limit:
            rows = rows[:limit]

        for lang, target_language in LANGUAGES.items():
            pending = []
            for row in rows:
                document_id = int(row["document_id"])
                if not force and get_project_translation(conn, document_id, lang):
                    log(f"[SKIP] {row['file_name']} {lang}")
                    continue
                pending.append(dict(row))

            for group in batched(pending, batch_size):
                compact_profiles = [compact_project(project) for project in group]
                try:
                    translated_by_id = translate_batch(compact_profiles, target_language)
                except Exception as exc:
                    log(f"[BATCH FAILED] {lang}: {type(exc).__name__}: {exc}")
                    translated_by_id = {}

                for project in group:
                    document_id = int(project["document_id"])
                    translated = translated_by_id.get(document_id)
                    if not translated:
                        chunks = get_project_chunks(conn, document_id)
                        try:
                            translated = translate_project_profile(project, chunks, target_language=target_language)
                        except Exception as exc:
                            log(
                                f"[FAILED] {project['file_name']} {lang}: "
                                f"{type(exc).__name__}: {exc}"
                            )
                            continue
                    save_project_translation(conn, document_id, translated, lang=lang)
                    log(f"[OK] {project['file_name']} {lang}")
                conn.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description="Build English and Chinese project profile translations.")
    parser.add_argument("--db", type=Path, default=DB_PATH)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    build_translations(args.db, limit=args.limit, force=args.force, batch_size=args.batch_size)


if __name__ == "__main__":
    main()
