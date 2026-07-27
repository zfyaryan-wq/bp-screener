from __future__ import annotations

import sqlite3
from typing import Any, Literal

from bp_screener.search import hybrid_search_chunks, search_chunks, semantic_search_chunks


RetrievalMode = Literal["hybrid", "keyword", "semantic"]

RAG_BOUNDARY = (
    "Lightweight RAG uses SQLite chunks, FTS keyword search, and local feature-hashing "
    "embeddings. Keep callers behind this module so a future vector backend can replace "
    "retrieval without changing agent or UI code."
)


def retrieve_chunks(
    conn: sqlite3.Connection,
    query: str,
    limit: int = 12,
    mode: RetrievalMode = "hybrid",
) -> list[dict[str, Any]]:
    """Retrieve BP evidence chunks without binding callers to a storage backend."""
    normalized_query = query.strip()
    if not normalized_query:
        return []
    safe_limit = max(1, int(limit))
    if mode == "keyword":
        return search_chunks(conn, normalized_query, limit=safe_limit)
    if mode == "semantic":
        return semantic_search_chunks(conn, normalized_query, limit=safe_limit)
    if mode != "hybrid":
        raise ValueError(f"Unsupported RAG retrieval mode: {mode}")
    return hybrid_search_chunks(conn, normalized_query, limit=safe_limit)


def format_sources(sources: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [format_source(index + 1, source) for index, source in enumerate(sources)]


def format_source(source_id: int, source: dict[str, Any]) -> dict[str, Any]:
    return {
        "source_id": source_id,
        "document_id": source.get("document_id"),
        "file_name": source.get("file_name"),
        "page": source.get("page"),
        "match_type": source.get("match_type"),
        "snippet": source.get("snippet", ""),
    }


def format_context(sources: list[dict[str, Any]], max_chars: int = 5000) -> str:
    """Render retrieved sources as a compact prompt context with stable citations."""
    lines: list[str] = []
    remaining = max(0, int(max_chars))
    for source in format_sources(sources):
        page = f", p.{source['page']}" if source.get("page") else ""
        header = f"[source {source['source_id']}: {source.get('file_name') or 'unknown'}{page}]"
        snippet = " ".join(str(source.get("snippet") or "").split())
        block = f"{header}\n{snippet}".strip()
        if not block:
            continue
        if len(block) > remaining:
            block = block[:remaining].rstrip()
        if block:
            lines.append(block)
            remaining -= len(block)
        if remaining <= 0:
            break
    return "\n\n".join(lines)
