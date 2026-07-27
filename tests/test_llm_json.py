import json

import pytest

from bp_screener.llm_json import loads_llm_json


def test_loads_plain_object() -> None:
    assert loads_llm_json('{"project_name": "Acme", "score": 88}') == {
        "project_name": "Acme",
        "score": 88,
    }


def test_loads_json_fence() -> None:
    assert loads_llm_json('```json\n{"ok": true, "items": [1, 2]}\n```') == {
        "ok": True,
        "items": [1, 2],
    }


def test_extracts_object_from_surrounding_text() -> None:
    content = "Here is the structured output:\n{\"company\": \"VRT\", \"stage\": \"seed\"}\nThanks."
    assert loads_llm_json(content) == {"company": "VRT", "stage": "seed"}


def test_non_object_json_returns_empty_dict() -> None:
    assert loads_llm_json("[1, 2, 3]") == {}


def test_invalid_json_without_object_raises() -> None:
    with pytest.raises(json.JSONDecodeError):
        loads_llm_json("not json at all")
