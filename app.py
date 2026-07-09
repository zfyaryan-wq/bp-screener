from __future__ import annotations

import shutil
from pathlib import Path

import pandas as pd
import streamlit as st

from bp_screener.config import INBOX_DIR
from bp_screener.db import connect
from bp_screener.ingest import ingest_path
from bp_screener.parsers import SUPPORTED_SUFFIXES
from bp_screener.search import get_project, list_projects, search_chunks


st.set_page_config(page_title="BP Screener", layout="wide")
st.title("BP Screener")
st.caption("Lightweight local parsing, structured SQLite profiles, and full-text search. Storage can be replaced later with Feishu Drive, OSS, COS, or any synced folder.")


def join_values(value: list | str | None) -> str:
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return value or ""


def save_uploads(files) -> int:
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    count = 0
    for uploaded in files:
        suffix = Path(uploaded.name).suffix.lower()
        if suffix not in SUPPORTED_SUFFIXES:
            continue
        target = INBOX_DIR / uploaded.name
        with target.open("wb") as handle:
            shutil.copyfileobj(uploaded, handle)
        count += 1
    return count


with st.sidebar:
    st.header("Ingestion")
    uploads = st.file_uploader(
        "Upload pitch deck files",
        type=[suffix.lstrip(".") for suffix in SUPPORTED_SUFFIXES],
        accept_multiple_files=True,
    )
    if st.button("Save uploaded files", disabled=not uploads):
        saved = save_uploads(uploads)
        st.success(f"Saved {saved} files to {INBOX_DIR}")

    use_llm = st.checkbox("Use DeepSeek / Cherry Studio extraction", value=True)
    limit = st.number_input("Max files to process in this run", min_value=1, max_value=10000, value=20)
    if st.button("Start / continue processing inbox"):
        with st.spinner("Processing files. This may take a while..."):
            ok, failed = ingest_path(INBOX_DIR, use_llm=use_llm, limit=int(limit))
        st.success(f"Processing complete: {ok} succeeded, {failed} failed")


tab_search, tab_projects, tab_detail = st.tabs(["Search", "Project Library", "Project Detail"])

with connect() as conn:
    with tab_search:
        query = st.text_input("Keyword search", placeholder="Examples: AI healthcare, embodied intelligence, Series A, annual revenue")
        if query:
            results = search_chunks(conn, query, limit=50)
            st.write(f"Found {len(results)} source snippets")
            for item in results:
                with st.container(border=True):
                    st.markdown(f"**{item['file_name']}** · Page {item['page'] or 'unknown'}")
                    st.write(item["snippet"])
                    if st.button("View project profile", key=f"detail-{item['document_id']}-{item['page']}"):
                        st.session_state["document_id"] = item["document_id"]
                        st.rerun()

    with tab_projects:
        col1, col2, col3, col4 = st.columns(4)
        industry = col1.text_input("Industry contains", placeholder="Healthcare / Education / Enterprise SaaS")
        stage = col2.text_input("Stage contains", placeholder="Seed / Angel / A")
        recommendation = col3.selectbox("Recommendation", ["", "高", "中", "低", "未知"])
        ai_only = col4.checkbox("AI-related only")

        rows = list_projects(
            conn,
            industry=industry,
            stage=stage,
            recommendation=recommendation,
            ai_only=ai_only,
        )
        table = pd.DataFrame(
            [
                {
                    "Document ID": row["document_id"],
                    "Project": row["project_name"],
                    "Company": row["company_name"],
                    "Industry": row["industry"],
                    "AI": "Yes" if row["ai_related"] else "No",
                    "AI Category": join_values(row["ai_category"]),
                    "Stage": row["financing_stage"],
                    "Business Model": row["business_model"],
                    "Recommendation": row["recommendation"],
                    "One-line Summary": row["one_line_summary"],
                    "File": row["file_name"],
                }
                for row in rows
            ]
        )
        st.dataframe(table, use_container_width=True, hide_index=True)
        if not table.empty:
            csv = table.to_csv(index=False).encode("utf-8-sig")
            st.download_button("Export CSV", csv, "bp_projects.csv", "text/csv")

    with tab_detail:
        document_id = st.number_input(
            "Document ID",
            min_value=1,
            value=int(st.session_state.get("document_id", 1)),
            step=1,
        )
        project = get_project(conn, int(document_id))
        if not project:
            st.info("No project found for this document ID. Ingest files first, or open a profile from search results.")
        else:
            st.subheader(project["project_name"])
            st.write(project["one_line_summary"])
            cols = st.columns(4)
            cols[0].metric("Industry", project["industry"])
            cols[1].metric("AI-related", "Yes" if project["ai_related"] else "No")
            cols[2].metric("Financing Stage", project["financing_stage"])
            cols[3].metric("Recommendation", project["recommendation"])

            st.markdown("**Business Model**")
            st.write(project["business_model"])
            st.markdown("**Team Highlights**")
            st.write(join_values(project["team_highlights"]) or "未知")
            st.markdown("**Traction**")
            st.write(join_values(project["traction"]) or "未知")
            st.markdown("**Customers / Users**")
            st.write(project["customers_or_users"])
            st.markdown("**Revenue / Financials**")
            st.write(project["revenue_or_financials"])
            st.markdown("**Risks**")
            st.write(join_values(project["risks"]) or "未知")
            st.markdown("**Tags**")
            st.write(join_values(project["tags"]) or "无")
            st.markdown("**Source File Path**")
            st.code(project["file_path"])

            if project["evidence"]:
                st.markdown("**Evidence**")
                for evidence in project["evidence"]:
                    st.write(f"- {evidence.get('field', 'Field')} · Page {evidence.get('page') or 'unknown'}: {evidence.get('quote', '')}")

