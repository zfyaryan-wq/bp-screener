from bp_screener.services.rag import format_context, format_sources


def test_format_sources_assigns_stable_ids_and_defaults() -> None:
    sources = format_sources(
        [
            {"document_id": 10, "file_name": "deck.pdf", "page": 2, "match_type": "keyword", "snippet": "alpha"},
            {"document_id": 11},
        ]
    )

    assert sources == [
        {
            "source_id": 1,
            "document_id": 10,
            "file_name": "deck.pdf",
            "page": 2,
            "match_type": "keyword",
            "snippet": "alpha",
        },
        {
            "source_id": 2,
            "document_id": 11,
            "file_name": None,
            "page": None,
            "match_type": None,
            "snippet": "",
        },
    ]


def test_format_context_compacts_whitespace_and_cites_page() -> None:
    context = format_context(
        [
            {
                "file_name": "deck.pdf",
                "page": 3,
                "snippet": "  first line\n\nsecond\tline  ",
            }
        ]
    )

    assert context == "[source 1: deck.pdf, p.3]\nfirst line second line"


def test_format_context_respects_max_chars() -> None:
    context = format_context([{"file_name": "long.pdf", "snippet": "abcdef"}], max_chars=12)

    assert len(context) <= 12
    assert context == "[source 1: l"


def test_format_context_handles_empty_and_unknown_source() -> None:
    assert format_context([]) == ""
    assert format_context([{"snippet": "evidence"}]) == "[source 1: unknown]\nevidence"
