import pytest

from scripts.process_ingest_jobs import (
    extract_rows,
    reconcile_uploaded_documents,
    recover_stale_processing_jobs,
    safe_file_name,
    normalize_statuses,
    sql_quote,
    stale_processing_where,
)


class FakeD1Client:
    def __init__(self, select_rows=None) -> None:
        self.select_rows = select_rows or []
        self.commands: list[str] = []

    def execute(self, sql: str):
        self.commands.append(sql)
        if sql.lstrip().upper().startswith("SELECT"):
            return self.select_rows
        return []


def test_sql_quote_escapes_single_quotes() -> None:
    assert sql_quote("Bob's BP") == "'Bob''s BP'"


def test_extract_rows_handles_wrapped_wrangler_payloads() -> None:
    payload = [
        {"result": [{"results": [{"id": 1}, {"id": 2}]}]},
        {"results": [{"id": 3}]},
    ]

    assert extract_rows(payload) == [{"id": 1}, {"id": 2}, {"id": 3}]


def test_extract_rows_ignores_non_row_payloads() -> None:
    assert extract_rows({"results": ["not", "rows"]}) == []
    assert extract_rows(None) == []


def test_normalize_statuses_defaults_to_queued_and_lowercases() -> None:
    assert normalize_statuses([]) == ["queued"]
    assert normalize_statuses([" Queued ", "FAILED"]) == ["queued", "failed"]


def test_normalize_statuses_rejects_unknown_values() -> None:
    with pytest.raises(SystemExit):
        normalize_statuses(["queued", "archived"])


def test_safe_file_name_strips_paths_and_replaces_unsafe_chars() -> None:
    assert safe_file_name("../bad/name:with*chars.pdf") == "name_with_chars.pdf"
    assert safe_file_name("", fallback="upload.pdf") == "upload.pdf"


def test_stale_processing_where_uses_claim_or_update_timestamp() -> None:
    where = stale_processing_where(45)

    assert "j.status = 'processing'" in where
    assert "COALESCE(j.claimed_at, j.updated_at, j.created_at)" in where
    assert "datetime('now', '-45 minutes')" in where


def test_recover_stale_processing_jobs_requeues_jobs_and_documents() -> None:
    client = FakeD1Client(
        [
            {
                "id": 7,
                "document_id": 42,
                "file_name": "demo.pdf",
                "source_platform": "feishu",
                "source_external_id": "file-token",
                "source_url": "https://example.test/file",
                "status": "processing",
                "attempts": 1,
                "error_message": "",
                "created_at": "2026-01-01 00:00:00",
                "updated_at": "2026-01-01 00:00:00",
                "claimed_at": "2026-01-01 00:00:00",
                "completed_at": "",
            }
        ]
    )

    jobs = recover_stale_processing_jobs(client, stale_minutes=60, limit=10, apply=True)

    assert [job.id for job in jobs] == [7]
    assert "UPDATE ingest_jobs" in client.commands[-1]
    assert "status = 'queued'" in client.commands[-1]
    assert "WHERE id IN (7)" in client.commands[-1]
    assert "UPDATE documents" in client.commands[-1]
    assert "WHERE id IN (42)" in client.commands[-1]


def test_reconcile_uploaded_documents_creates_missing_ingest_jobs() -> None:
    client = FakeD1Client(
        [
            {
                "id": 42,
                "file_name": "Bob's BP.pdf",
                "source_platform": "feishu",
                "source_external_id": "file-token",
                "source_url": "https://example.test/file",
                "created_at": "2026-01-01 00:00:00",
                "updated_at": "2026-01-01 00:00:00",
            }
        ]
    )

    documents = reconcile_uploaded_documents(client, limit=10, apply=True)

    assert [document.id for document in documents] == [42]
    assert "LEFT JOIN ingest_jobs" in client.commands[0]
    assert "d.status = 'uploaded' AND j.id IS NULL" in client.commands[0]
    assert "INSERT INTO ingest_jobs" in client.commands[-1]
    assert "(42, 'feishu', 'file-token', 'https://example.test/file'" in client.commands[-1]
    assert "ON CONFLICT(document_id) DO NOTHING" in client.commands[-1]
