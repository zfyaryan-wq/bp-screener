import pytest

from scripts.process_ingest_jobs import extract_rows, normalize_statuses, safe_file_name, sql_quote


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
