from __future__ import annotations

from io import BytesIO
import os
import shutil
from pathlib import Path

import pandas as pd
import streamlit as st

from bp_screener.config import INBOX_DIR
from bp_screener.agent import answer_project_question
from bp_screener.db import (
    activity_rows,
    connect,
    delete_document,
    deleted_document_rows,
    document_rows,
    document_stats,
    get_committee_review,
    get_project_review,
    get_project_translation,
    log_activity,
    personal_review_rows,
    reviewer_rows,
    restore_document,
    save_committee_review,
    save_personal_review,
    save_project_review,
    save_project_translation,
    save_reviewer,
    save_reviewer_criteria,
    team_consensus,
)
from bp_screener.ingest import ingest_path
from bp_screener.parsers import SUPPORTED_SUFFIXES
from bp_screener.services.committee import generate_committee_review
from bp_screener.services.library_qa import answer_library_question
from bp_screener.services.translation import translate_project_profile
from bp_screener.search import (
    ai_relevance_counts,
    committee_decision_counts,
    committee_score_band_counts,
    count_by_field,
    count_projects,
    get_project,
    hybrid_search_chunks,
    list_projects,
    list_projects_page,
    project_metric_counts,
    search_chunks,
    semantic_search_chunks,
    similar_projects,
)
from bp_screener.ui.charts import (
    ai_count_dataframe,
    clean_chart_value,
    committee_decision_dataframe,
    committee_score_band_dataframe,
    counts_to_dataframe,
    field_count_dataframe,
    list_field_count_dataframe,
    render_bar_chart,
    render_donut_chart,
)
from bp_screener.ui.pdf_preview import cleanup_pdf_previews, pdf_preview_html, pdf_preview_url
from bp_screener.ui.styles import APP_CSS


from bp_screener.ui.i18n import (
    LABELS,
    RECOMMENDATION_LABELS,
    REVIEW_STATUS_LABELS,
    REVIEW_STATUS_VALUES,
    STATUS_LABELS,
)

st.set_page_config(page_title="BP Screener Workbench", layout="wide")

st.markdown(APP_CSS, unsafe_allow_html=True)


def join_values(value: list | str | None) -> str:
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return value or ""


def localized_value(value: object, labels: dict) -> str:
    if value is None:
        return labels["empty"]
    text = str(value).strip()
    if not text or text in {"未知", "unknown", "None"}:
        return labels["empty"]
    return text


def localized_recommendation(value: object, lang: str) -> str:
    text = str(value or "").strip()
    return RECOMMENDATION_LABELS[lang].get(text, text)


def localized_status(value: object, lang: str) -> str:
    text = str(value or "new").strip()
    return STATUS_LABELS[lang].get(text, text)


def localized_page(page: int | None, labels: dict) -> str:
    if labels["page"] == "第":
        return f"第 {page or labels['unknown']} 页"
    return f"Page {page or labels['unknown']}"


def save_uploads(files) -> list[Path]:
    INBOX_DIR.mkdir(parents=True, exist_ok=True)
    saved_paths: list[Path] = []
    for uploaded in files:
        suffix = Path(uploaded.name).suffix.lower()
        if suffix not in SUPPORTED_SUFFIXES:
            continue
        target = INBOX_DIR / uploaded.name
        with target.open("wb") as handle:
            shutil.copyfileobj(uploaded, handle)
        saved_paths.append(target)
    return saved_paths


def table_bytes_excel(table: pd.DataFrame) -> bytes:
    output = BytesIO()
    with pd.ExcelWriter(output, engine="xlsxwriter") as writer:
        table.to_excel(writer, index=False, sheet_name="Projects")
        worksheet = writer.sheets["Projects"]
        for index, column in enumerate(table.columns):
            width = min(max(12, int(table[column].astype(str).str.len().max() or 12)), 60)
            worksheet.set_column(index, index, width)
    return output.getvalue()


def retry_failed_documents(paths: list[str], use_llm: bool) -> tuple[int, int]:
    ok = 0
    failed = 0
    for path in paths:
        current_ok, current_failed = ingest_path(Path(path), use_llm=use_llm, limit=1, force=True)
        ok += current_ok
        failed += current_failed
    return ok, failed


def get_project_chunks(conn, document_id: int, limit: int = 12) -> list[dict]:
    rows = conn.execute(
        """
        SELECT page, chunk_index, content
        FROM chunks
        WHERE document_id = ?
        ORDER BY chunk_index ASC
        LIMIT ?
        """,
        (document_id, limit),
    ).fetchall()
    return [dict(row) for row in rows]


def translation_key(document_id: int | str, target: str = "en") -> str:
    return f"profile_translation_{target}_{document_id}"


def display_project_row(conn, row: dict, lang: str) -> dict:
    if lang != "en":
        return row
    key = translation_key(row["document_id"])
    if key not in st.session_state:
        translated = get_project_translation(conn, int(row["document_id"]))
        if translated:
            st.session_state[key] = translated
    translated = st.session_state.get(key)
    if not translated:
        return row
    merged = dict(row)
    merged.update(translated)
    return merged


def review_status_label(value: str, lang: str) -> str:
    return REVIEW_STATUS_LABELS[lang].get(value, value)


def review_status_value(label: str, lang: str) -> str:
    if lang == "zh":
        return label
    return REVIEW_STATUS_VALUES.get(label, label)


def render_inline_bp_view(conn, document_id: int, labels: dict, lang: str) -> None:
    project = get_project(conn, int(document_id))
    if not project:
        st.info(labels["no_project"])
        return

    display_project = project
    if lang == "en":
        translated = get_project_translation(conn, int(document_id))
        if translated:
            display_project = translated

    st.markdown(f"### {labels['selected_bp']}: {display_project.get('project_name') or labels['empty']}")
    st.info(labels["opened_from_card"])
    st.write(localized_value(display_project.get("one_line_summary"), labels))

    cols = st.columns(4)
    cols[0].metric(labels["detail"]["industry"], localized_value(display_project.get("industry"), labels))
    cols[1].metric(labels["detail"]["ai_related"], labels["yes"] if display_project.get("ai_related") else labels["no"])
    cols[2].metric(labels["detail"]["stage"], localized_value(display_project.get("financing_stage"), labels))
    cols[3].metric(
        labels["detail"]["recommendation"],
        localized_recommendation(display_project.get("recommendation"), lang),
    )

    source_path = Path(project["file_path"])
    st.markdown(f"**{labels['detail']['preview']}**")
    if source_path.exists() and source_path.suffix.lower() == ".pdf":
        preview_url = pdf_preview_url(source_path, int(document_id))
        st.markdown(pdf_preview_html(source_path, int(document_id)), unsafe_allow_html=True)
        st.link_button(labels["detail"]["open_new_tab"], preview_url)
        st.download_button(
            labels["detail"]["open_local"],
            data=source_path.read_bytes(),
            file_name=source_path.name,
            mime="application/pdf",
            key=f"download-inline-{document_id}",
        )
    else:
        st.info(labels["detail"]["preview_unavailable"])
        st.code(project["file_name"])

    if display_project.get("evidence"):
        st.markdown(f"**{labels['detail']['evidence']}**")
        evidence_table = pd.DataFrame(
            [
                {
                    labels["detail"]["field"]: evidence.get("field", labels["detail"]["field"]),
                    labels["page"]: evidence.get("page") or labels["unknown"],
                    "Quote" if lang == "en" else "原文": evidence.get("quote", ""),
                }
                for evidence in display_project["evidence"]
            ]
        )
        st.dataframe(evidence_table, use_container_width=True, hide_index=True)


def project_card_html(row: dict, labels: dict, lang: str) -> str:
    tags = [
        localized_value(row.get("industry"), labels),
        localized_value(row.get("financing_stage"), labels),
        "AI" if row.get("ai_related") else "",
        *[str(tag) for tag in (row.get("tags") or [])[:2]],
    ]
    pills = "".join(f'<span class="pill">{tag}</span>' for tag in tags if tag and tag != labels["empty"])
    summary = localized_value(row.get("one_line_summary"), labels)
    recommendation = localized_recommendation(row.get("recommendation"), lang) or labels["empty"]
    return f"""
    <div class="project-card">
      <h3>{row.get("project_name") or row.get("company_name") or labels["empty"]}</h3>
      <div>{pills}</div>
      <p>{summary}</p>
      <p><strong>{labels["columns"]["recommendation"]}:</strong> {recommendation}</p>
    </div>
    """


with st.sidebar:
    st.caption("Interface language: English")
    lang = "en"
    labels = LABELS[lang]
    actor = st.text_input(labels["actor"], value=st.session_state.get("actor", ""), help=labels["actor_help"])
    st.session_state["actor"] = actor.strip()

st.markdown(
    f"""
    <div class="hero-card">
      <h1 class="hero-title">{labels["page_title"]}</h1>
    </div>
    """,
    unsafe_allow_html=True,
)

with st.sidebar:
    st.header(labels["ingestion"])
    uploads = st.file_uploader(
        labels["upload"],
        type=[suffix.lstrip(".") for suffix in SUPPORTED_SUFFIXES],
        accept_multiple_files=True,
    )
    use_llm = st.checkbox(labels["use_llm"], value=True)
    auto_process = st.checkbox(labels["auto_process"], value=True)
    if st.button(labels["save"], disabled=not uploads):
        saved_paths = save_uploads(uploads)
        with connect() as sidebar_conn:
            for saved_path in saved_paths:
                log_activity(
                    sidebar_conn,
                    st.session_state.get("actor", ""),
                    "add",
                    file_name=saved_path.name,
                    detail=f"Uploaded to {saved_path}",
                )
            sidebar_conn.commit()
        if auto_process and saved_paths:
            ok = 0
            failed = 0
            with st.spinner(labels["processing"]):
                for saved_path in saved_paths:
                    current_ok, current_failed = ingest_path(saved_path, use_llm=use_llm, limit=1, force=True)
                    ok += current_ok
                    failed += current_failed
                    with connect() as sidebar_conn:
                        row = sidebar_conn.execute(
                            "SELECT id FROM documents WHERE file_path = ?",
                            (str(saved_path),),
                        ).fetchone()
                        log_activity(
                            sidebar_conn,
                            st.session_state.get("actor", ""),
                            "update" if current_failed == 0 else "failed",
                            int(row["id"]) if row else None,
                            saved_path.name,
                            "Analyzed after upload" if current_failed == 0 else "Analysis failed after upload",
                        )
                        sidebar_conn.commit()
            st.success(labels["upload_processed"].format(ok=ok, failed=failed))
        else:
            st.success(labels["saved"].format(saved=len(saved_paths), path=INBOX_DIR))

    limit = st.number_input(labels["limit"], min_value=1, max_value=10000, value=20)
    force_process = st.checkbox(labels["force_process"], value=False)
    if st.button(labels["process"]):
        with st.spinner(labels["processing"]):
            ok, failed = ingest_path(INBOX_DIR, use_llm=use_llm, limit=int(limit), force=force_process)
        with connect() as sidebar_conn:
            log_activity(
                sidebar_conn,
                st.session_state.get("actor", ""),
                "update",
                detail=f"Analyzed inbox: {ok} succeeded, {failed} failed",
            )
            sidebar_conn.commit()
        st.success(labels["processed"].format(ok=ok, failed=failed))


tab_search, tab_library_qa, tab_team, tab_projects, tab_analytics, tab_detail, tab_status = st.tabs(labels["tabs"])

with connect() as conn:
    with tab_search:
        stats = document_stats(conn)
        total_projects = count_projects(conn)
        ai_project_count = count_projects(conn, ai_only=True)
        metric_cols = st.columns(4)
        metric_cols[0].metric(labels["status"]["total"], total_projects)
        metric_cols[1].metric(labels["status"]["done"], stats.get("done", 0))
        metric_cols[2].metric(labels["detail"]["ai_related"], ai_project_count)
        metric_cols[3].metric(labels["status"]["failed"], stats.get("failed", 0))

        query_cols = st.columns([3, 1])
        query = query_cols[0].text_input(labels["keyword"], placeholder=labels["keyword_placeholder"])
        search_mode = query_cols[1].selectbox(
            labels["search_mode"],
            labels["search_modes"],
            index=0,
        )
        if query:
            if search_mode == labels["search_modes"][1]:
                results = search_chunks(conn, query, limit=50)
            elif search_mode == labels["search_modes"][2]:
                results = semantic_search_chunks(conn, query, limit=50)
            else:
                results = hybrid_search_chunks(conn, query, limit=50)
            st.write(labels["found"].format(count=len(results)))
            for item in results:
                with st.container(border=True):
                    match_type = item.get("match_type")
                    match_suffix = f" · `{match_type}`" if match_type else ""
                    st.markdown(f"**{item['file_name']}** · {localized_page(item['page'], labels)}{match_suffix}")
                    st.write(item["snippet"])
                    if st.button(labels["view_profile"], key=f"detail-{item['document_id']}-{item['page']}"):
                        st.session_state["document_id"] = item["document_id"]
                        st.rerun()

    with tab_library_qa:
        st.markdown(f"### {labels['library_qa']['title']}")
        st.caption(labels["library_qa"]["subtitle"])
        with st.form("library-qa-form"):
            library_question = st.text_area(
                labels["library_qa"]["title"],
                placeholder=labels["library_qa"]["placeholder"],
                height=110,
                label_visibility="collapsed",
            )
            ask_submitted = st.form_submit_button(labels["library_qa"]["ask"])

        if ask_submitted:
            if not library_question.strip():
                st.warning(labels["library_qa"]["no_question"])
            else:
                with st.spinner(labels["library_qa"]["thinking"]):
                    try:
                        library_answer = answer_library_question(conn, library_question, lang=lang)
                        st.session_state["library_qa_last"] = library_answer
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "ask",
                            detail=f"Library QA: {library_question[:300]}",
                        )
                        conn.commit()
                    except Exception as exc:
                        st.error(f"{'Library QA failed:' if lang == 'en' else '全库问答失败：'} {exc}")

        if st.session_state.get("library_qa_last"):
            result = st.session_state["library_qa_last"]
            st.markdown(f"**{labels['library_qa']['answer']}**")
            st.write(result.get("answer") or labels["empty"])
            sources = result.get("sources") or []
            if sources:
                st.markdown(f"**{labels['library_qa']['sources']}**")
                st.dataframe(
                    pd.DataFrame(
                        [
                            {
                                labels["columns"]["document_id"]: source.get("document_id"),
                                labels["columns"]["file"]: source.get("file_name"),
                                labels["page"]: source.get("page"),
                                labels["search_mode"]: source.get("match_type"),
                                "Snippet" if lang == "en" else "片段": source.get("snippet"),
                            }
                            for source in sources
                        ]
                    ),
                    use_container_width=True,
                    hide_index=True,
                )

    with tab_team:
        st.markdown(f"### {labels['team']['title']}")
        st.caption(labels["team"]["subtitle"])
        team_rows = reviewer_rows(conn)
        st.markdown(f"**{labels['team']['reviewers']}**")
        for reviewer in team_rows:
            with st.expander(f"{reviewer['name']} · {reviewer.get('role') or labels['empty']}", expanded=False):
                with st.form(f"reviewer-form-{reviewer['id']}"):
                    profile_cols = st.columns(2)
                    reviewer_name = profile_cols[0].text_input(
                        labels["team"]["name"],
                        value=reviewer["name"],
                        key=f"reviewer-name-{reviewer['id']}",
                    )
                    reviewer_role = profile_cols[1].text_input(
                        labels["team"]["role"],
                        value=reviewer.get("role") or "",
                        key=f"reviewer-role-{reviewer['id']}",
                    )
                    st.markdown(f"**{labels['team']['criteria']}**")
                    criteria_cols = st.columns(2)
                    preferred_industries = criteria_cols[0].text_area(
                        labels["team"]["preferred_industries"],
                        value=reviewer.get("preferred_industries") or "",
                        key=f"preferred-industries-{reviewer['id']}",
                    )
                    avoided_industries = criteria_cols[1].text_area(
                        labels["team"]["avoided_industries"],
                        value=reviewer.get("avoided_industries") or "",
                        key=f"avoided-industries-{reviewer['id']}",
                    )
                    stage_preference = criteria_cols[0].text_input(
                        labels["team"]["stage_preference"],
                        value=reviewer.get("stage_preference") or "",
                        key=f"stage-preference-{reviewer['id']}",
                    )
                    ai_preference = criteria_cols[1].text_input(
                        labels["team"]["ai_preference"],
                        value=reviewer.get("ai_preference") or "",
                        key=f"ai-preference-{reviewer['id']}",
                    )
                    team_preference = criteria_cols[0].text_area(
                        labels["team"]["team_preference"],
                        value=reviewer.get("team_preference") or "",
                        key=f"team-preference-{reviewer['id']}",
                    )
                    traction_preference = criteria_cols[1].text_area(
                        labels["team"]["traction_preference"],
                        value=reviewer.get("traction_preference") or "",
                        key=f"traction-preference-{reviewer['id']}",
                    )
                    red_flags = st.text_area(
                        labels["team"]["red_flags"],
                        value=reviewer.get("red_flags") or "",
                        key=f"red-flags-{reviewer['id']}",
                    )
                    scoring_rubric = st.text_area(
                        labels["team"]["scoring_rubric"],
                        value=reviewer.get("scoring_rubric") or "",
                        key=f"scoring-rubric-{reviewer['id']}",
                    )
                    if st.form_submit_button(labels["team"]["save_criteria"]):
                        save_reviewer(conn, int(reviewer["id"]), reviewer_name, reviewer_role, active=True)
                        save_reviewer_criteria(
                            conn,
                            int(reviewer["id"]),
                            {
                                "preferred_industries": preferred_industries,
                                "avoided_industries": avoided_industries,
                                "stage_preference": stage_preference,
                                "ai_preference": ai_preference,
                                "team_preference": team_preference,
                                "traction_preference": traction_preference,
                                "red_flags": red_flags,
                                "scoring_rubric": scoring_rubric,
                            },
                        )
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "update",
                            detail=f"Updated reviewer criteria: {reviewer_name}",
                        )
                        conn.commit()
                        st.success(labels["team"]["saved"])
                        st.rerun()

    with tab_projects:
        col1, col2, col3, col4 = st.columns(4)
        industry = col1.text_input(labels["industry_filter"], placeholder=labels["industry_placeholder"])
        stage = col2.text_input(labels["stage_filter"], placeholder=labels["stage_placeholder"])
        if lang == "zh":
            recommendation = col3.selectbox(labels["recommendation"], ["", "高", "中", "低", "未知"])
        else:
            recommendation_label = col3.selectbox(labels["recommendation"], ["", "High", "Medium", "Low", "Unknown"])
            recommendation = {
                "High": "高",
                "Medium": "中",
                "Low": "低",
                "Unknown": "未知",
            }.get(recommendation_label, "")
        ai_only = col4.checkbox(labels["ai_only"])

        total_rows = count_projects(
            conn,
            industry=industry,
            stage=stage,
            recommendation=recommendation,
            ai_only=ai_only,
        )
        page_cols = st.columns([1, 1, 2])
        page_size = int(page_cols[0].selectbox(labels["page_size"], [6, 12, 24, 48], index=1))
        max_page = max(1, (total_rows + page_size - 1) // page_size)
        page_number = int(page_cols[1].number_input(labels["page_number"], min_value=1, max_value=max_page, value=1))
        start_index = (page_number - 1) * page_size
        end_index = min(start_index + page_size, total_rows)
        page_rows = list_projects_page(
            conn,
            industry=industry,
            stage=stage,
            recommendation=recommendation,
            ai_only=ai_only,
            limit=page_size,
            offset=start_index,
        )
        if total_rows:
            page_cols[2].markdown(
                labels["page_summary"].format(start=start_index + 1, end=end_index, total=total_rows)
            )

        display_rows = [display_project_row(conn, row, lang) for row in page_rows]
        if lang == "en" and display_rows:
            if st.button(labels["translate_visible"], help=labels["translate_visible_help"]):
                translated_count = 0
                with st.spinner(labels["detail"]["translating"]):
                    for row in page_rows[:20]:
                        key = translation_key(row["document_id"])
                        if key in st.session_state:
                            continue
                        existing = get_project_translation(conn, int(row["document_id"]))
                        if existing:
                            st.session_state[key] = existing
                            continue
                        try:
                            chunks = get_project_chunks(conn, int(row["document_id"]))
                            translated_profile = translate_project_profile(row, chunks)
                            save_project_translation(conn, int(row["document_id"]), translated_profile)
                            log_activity(
                                conn,
                                st.session_state.get("actor", ""),
                                "update",
                                int(row["document_id"]),
                                row.get("file_name", ""),
                                "Translated BP profile to English",
                            )
                            conn.commit()
                            st.session_state[key] = translated_profile
                            translated_count += 1
                        except Exception as exc:
                            log_activity(
                                conn,
                                st.session_state.get("actor", ""),
                                "failed",
                                int(row["document_id"]),
                                row.get("file_name", ""),
                                f"Translation failed: {exc}",
                            )
                            conn.commit()
                st.success(labels["visible_translated"].format(count=translated_count))
                st.rerun()
        if display_rows:
            card_columns = st.columns(3)
            for index, row in enumerate(display_rows[:6]):
                with card_columns[index % 3]:
                    st.markdown(project_card_html(row, labels, lang), unsafe_allow_html=True)
                    if st.button(labels["open_bp"], key=f"open-card-{row['document_id']}", use_container_width=True):
                        st.session_state["document_id"] = int(row["document_id"])
                        st.session_state["library_open_document_id"] = int(row["document_id"])
                        st.rerun()

        if st.session_state.get("library_open_document_id"):
            render_inline_bp_view(conn, int(st.session_state["library_open_document_id"]), labels, lang)

        consensus_by_document = {
            int(row["document_id"]): team_consensus(conn, int(row["document_id"]))
            for row in display_rows
        }
        table = pd.DataFrame(
            [
                {
                    labels["columns"]["document_id"]: row["document_id"],
                    labels["columns"]["project"]: row["project_name"],
                    labels["columns"]["company"]: row["company_name"],
                    labels["columns"]["industry"]: row["industry"],
                    "AI": labels["yes"] if row["ai_related"] else labels["no"],
                    labels["columns"]["ai_category"]: join_values(row["ai_category"]),
                    labels["columns"]["stage"]: localized_value(row["financing_stage"], labels),
                    labels["columns"]["business_model"]: localized_value(row["business_model"], labels),
                    labels["columns"]["recommendation"]: localized_recommendation(row["recommendation"], lang),
                    labels["columns"]["summary"]: localized_value(row["one_line_summary"], labels),
                    labels["columns"]["review_status"]: review_status_label(
                        row.get("review_status", "待看"),
                        lang,
                    ),
                    labels["columns"]["owner"]: row.get("owner", ""),
                    labels["columns"]["committee_score"]: row.get("committee_score") or labels["committee"]["not_run"],
                    labels["columns"]["committee_decision"]: row.get("committee_decision")
                    or labels["committee"]["not_run"],
                    labels["team"]["team_decision"]: consensus_by_document[int(row["document_id"])]["team_decision"],
                    labels["team"]["average_score"]: consensus_by_document[int(row["document_id"])]["average_score"],
                    labels["team"]["reviewed"]: (
                        f"{consensus_by_document[int(row['document_id'])]['reviewed_count']}/"
                        f"{consensus_by_document[int(row['document_id'])]['reviewer_count']}"
                    ),
                    labels["columns"]["file"]: row["file_name"],
                }
                for row in display_rows
            ]
        )
        st.dataframe(table, use_container_width=True, hide_index=True)
        if not table.empty:
            csv = table.to_csv(index=False).encode("utf-8-sig")
            st.download_button(labels["export"], csv, "bp_projects.csv", "text/csv")
            st.download_button(
                labels["export_excel"],
                table_bytes_excel(table),
                "bp_projects.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            )

    with tab_analytics:
        analytics_rows = list_projects(conn)
        metrics = project_metric_counts(conn)
        if not metrics["project_count"]:
            st.info(labels["analytics"]["no_data"])
        else:
            industries = [
                str(row["category"])
                for row in count_by_field(conn, "industry", top_n=1000)
                if str(row["category"]) != "Unknown"
            ]
            metric_cols = st.columns(4)
            metric_cols[0].metric(labels["analytics"]["project_count"], metrics["project_count"])
            metric_cols[1].metric(labels["analytics"]["industry_count"], metrics["industry_count"])
            metric_cols[2].metric(labels["analytics"]["ai_count"], metrics["ai_count"])
            metric_cols[3].metric(labels["analytics"]["reviewed_count"], metrics["reviewed_count"])

            st.markdown(f"### {labels['analytics']['horizontal']}")
            row1_col1, row1_col2 = st.columns(2)
            with row1_col1:
                render_bar_chart(
                    counts_to_dataframe(count_by_field(conn, "industry"), labels),
                    labels["analytics"]["industry_dist"],
                    labels,
                )
            with row1_col2:
                render_donut_chart(
                    counts_to_dataframe(
                        ai_relevance_counts(conn),
                        labels,
                        translate={"yes": labels["yes"], "no": labels["no"]},
                    ),
                    labels["analytics"]["ai_dist"],
                    labels,
                )

            row2_col1, row2_col2 = st.columns(2)
            with row2_col1:
                render_bar_chart(
                    counts_to_dataframe(count_by_field(conn, "financing_stage"), labels),
                    labels["analytics"]["stage_dist"],
                    labels,
                )
            with row2_col2:
                render_donut_chart(
                    counts_to_dataframe(
                        count_by_field(conn, "recommendation"),
                        labels,
                        translate={
                            "高": localized_recommendation("高", lang),
                            "中": localized_recommendation("中", lang),
                            "低": localized_recommendation("低", lang),
                            "未知": localized_recommendation("未知", lang),
                        },
                    ),
                    labels["analytics"]["recommendation_dist"],
                    labels,
                )

            row3_col1, row3_col2 = st.columns(2)
            with row3_col1:
                render_bar_chart(
                    list_field_count_dataframe(analytics_rows, "ai_category", labels),
                    labels["analytics"]["ai_category_dist"],
                    labels,
                )
            with row3_col2:
                render_bar_chart(
                    list_field_count_dataframe(analytics_rows, "tags", labels),
                    labels["analytics"]["tag_dist"],
                    labels,
                )

            row4_col1, row4_col2 = st.columns(2)
            with row4_col1:
                render_bar_chart(
                    counts_to_dataframe(
                        committee_decision_counts(conn),
                        labels,
                        translate={"Not reviewed": labels["committee"]["not_run"]},
                    ),
                    labels["analytics"]["committee_decision_dist"],
                    labels,
                )
            with row4_col2:
                render_donut_chart(
                    counts_to_dataframe(
                        committee_score_band_counts(conn),
                        labels,
                        translate={"Not reviewed": labels["committee"]["not_run"]},
                    ),
                    labels["analytics"]["committee_score_dist"],
                    labels,
                )

            st.markdown(f"### {labels['analytics']['vertical']}")
            if industries:
                selected_industry = st.selectbox(labels["analytics"]["select_industry"], industries)
                industry_rows = [
                    row for row in analytics_rows if clean_chart_value(row.get("industry"), labels) == selected_industry
                ]
                field_cols = st.columns(3)
                field_cols[0].metric(labels["analytics"]["project_count"], len(industry_rows))
                field_cols[1].metric(labels["analytics"]["ai_count"], sum(1 for row in industry_rows if row["ai_related"]))
                field_cols[2].metric(
                    labels["analytics"]["reviewed_count"],
                    sum(1 for row in industry_rows if row.get("committee_decision") or row.get("committee_score")),
                )

                field_row1_col1, field_row1_col2 = st.columns(2)
                with field_row1_col1:
                    render_bar_chart(
                        field_count_dataframe(industry_rows, "financing_stage", labels),
                        labels["analytics"]["stage_dist"],
                        labels,
                    )
                with field_row1_col2:
                    render_donut_chart(
                        ai_count_dataframe(industry_rows, labels),
                        labels["analytics"]["ai_dist"],
                        labels,
                    )

                field_row2_col1, field_row2_col2 = st.columns(2)
                with field_row2_col1:
                    render_bar_chart(
                        list_field_count_dataframe(industry_rows, "ai_category", labels),
                        labels["analytics"]["ai_category_dist"],
                        labels,
                    )
                with field_row2_col2:
                    render_bar_chart(
                        committee_decision_dataframe(conn, industry_rows, labels),
                        labels["analytics"]["committee_decision_dist"],
                        labels,
                    )

                st.markdown(f"**{labels['analytics']['top_projects']}**")
                project_rows = []
                for row in industry_rows:
                    project_rows.append(
                        {
                            labels["columns"]["document_id"]: row["document_id"],
                            labels["columns"]["project"]: row["project_name"],
                            labels["columns"]["stage"]: localized_value(row["financing_stage"], labels),
                            labels["columns"]["recommendation"]: localized_recommendation(row["recommendation"], lang),
                            labels["columns"]["committee_score"]: row.get("committee_score", ""),
                            labels["columns"]["committee_decision"]: row.get("committee_decision", ""),
                            labels["columns"]["summary"]: localized_value(row["one_line_summary"], labels),
                        }
                    )
                st.dataframe(pd.DataFrame(project_rows), use_container_width=True, hide_index=True)
            else:
                st.info(labels["analytics"]["no_data"])

    with tab_detail:
        document_id = st.number_input(
            labels["columns"]["document_id"],
            min_value=1,
            value=int(st.session_state.get("document_id", 1)),
            step=1,
        )
        project = get_project(conn, int(document_id))
        if not project:
            st.info(labels["no_project"])
        else:
            english_translation_key = translation_key(document_id, "en")
            chinese_translation_key = translation_key(document_id, "zh")
            stored_translation = get_project_translation(conn, int(document_id))
            if stored_translation and english_translation_key not in st.session_state:
                st.session_state[english_translation_key] = stored_translation
            action_cols = st.columns([1, 1, 1, 2])
            if action_cols[0].button(labels["detail"]["translate"], key=f"translate-en-{document_id}"):
                with st.spinner(labels["detail"]["translating"]):
                    try:
                        chunks = get_project_chunks(conn, int(document_id))
                        translated_profile = translate_project_profile(project, chunks, target_language="English")
                        save_project_translation(conn, int(document_id), translated_profile)
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "update",
                            int(document_id),
                            project.get("file_name", ""),
                            "Translated BP profile to English",
                        )
                        conn.commit()
                        st.session_state[english_translation_key] = translated_profile
                    except Exception as exc:
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "failed",
                            int(document_id),
                            project.get("file_name", ""),
                            f"Translation failed: {exc}",
                        )
                        conn.commit()
                        st.error(f"Translation failed: {exc}")
            if action_cols[1].button(
                labels["detail"].get("translate_cn", "Translate this BP profile to Chinese"),
                key=f"translate-zh-{document_id}",
            ):
                with st.spinner(
                    labels["detail"].get("translating_cn", "Translating the structured profile to Chinese with the LLM...")
                ):
                    try:
                        chunks = get_project_chunks(conn, int(document_id))
                        translated_profile = translate_project_profile(project, chunks, target_language="Chinese")
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "update",
                            int(document_id),
                            project.get("file_name", ""),
                            "Translated BP profile to Chinese",
                        )
                        conn.commit()
                        st.session_state[chinese_translation_key] = translated_profile
                    except Exception as exc:
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "failed",
                            int(document_id),
                            project.get("file_name", ""),
                            f"Chinese translation failed: {exc}",
                        )
                        conn.commit()
                        st.error(f"Chinese translation failed: {exc}")
            if english_translation_key in st.session_state or chinese_translation_key in st.session_state:
                if action_cols[2].button(labels["detail"]["clear_translation"], key=f"clear-translation-{document_id}"):
                    st.session_state.pop(english_translation_key, None)
                    st.session_state.pop(chinese_translation_key, None)
                    st.rerun()

            display_project = st.session_state.get(
                chinese_translation_key,
                st.session_state.get(english_translation_key, project),
            )
            if chinese_translation_key in st.session_state:
                st.info(
                    labels["detail"].get(
                        "translated_cn",
                        "Showing LLM-translated Chinese profile. Source file and original evidence remain available below.",
                    )
                )
            elif english_translation_key in st.session_state:
                st.info(labels["detail"]["translated"])

            st.subheader(display_project["project_name"])
            st.write(display_project["one_line_summary"])

            st.markdown(f"### {labels['team']['personal_reviews']}")
            consensus = team_consensus(conn, int(document_id))
            consensus_cols = st.columns(4)
            consensus_cols[0].metric(
                labels["team"]["reviewed"],
                f"{consensus['reviewed_count']}/{consensus['reviewer_count']}",
            )
            consensus_cols[1].metric(labels["team"]["average_score"], consensus["average_score"])
            consensus_cols[2].metric(labels["team"]["interested"], consensus["interested_count"])
            consensus_cols[3].metric(labels["team"]["team_decision"], consensus["team_decision"])

            for personal_review in personal_review_rows(conn, int(document_id)):
                reviewer_id = int(personal_review["reviewer_id"])
                reviewer_title = (
                    f"{personal_review['reviewer_name']} · "
                    f"{personal_review.get('decision') or 'To review'} · "
                    f"{int(personal_review.get('score') or 0)}"
                )
                with st.expander(reviewer_title, expanded=False):
                    with st.form(f"personal-review-{document_id}-{reviewer_id}"):
                        review_cols = st.columns([1, 1, 2])
                        decision_options = labels["team"]["decision_options"]
                        current_decision = personal_review.get("decision") or "To review"
                        decision_index = (
                            decision_options.index(current_decision)
                            if current_decision in decision_options
                            else 0
                        )
                        decision = review_cols[0].selectbox(
                            labels["team"]["decision"],
                            decision_options,
                            index=decision_index,
                            key=f"decision-{document_id}-{reviewer_id}",
                        )
                        score = review_cols[1].number_input(
                            labels["team"]["score"],
                            min_value=0,
                            max_value=100,
                            value=int(personal_review.get("score") or 0),
                            step=5,
                            key=f"score-{document_id}-{reviewer_id}",
                        )
                        tags = review_cols[2].text_input(
                            labels["team"]["tags"],
                            value=", ".join(personal_review.get("tags") or []),
                            key=f"tags-{document_id}-{reviewer_id}",
                        )
                        rationale = st.text_area(
                            labels["team"]["rationale"],
                            value=personal_review.get("rationale") or "",
                            key=f"rationale-{document_id}-{reviewer_id}",
                        )
                        concerns = st.text_area(
                            labels["team"]["concerns"],
                            value=personal_review.get("concerns") or "",
                            key=f"concerns-{document_id}-{reviewer_id}",
                        )
                        questions = st.text_area(
                            labels["team"]["questions"],
                            value=personal_review.get("questions") or "",
                            key=f"questions-{document_id}-{reviewer_id}",
                        )
                        if st.form_submit_button(labels["team"]["save_review"]):
                            save_personal_review(
                                conn,
                                int(document_id),
                                reviewer_id,
                                decision,
                                int(score),
                                rationale,
                                concerns,
                                questions,
                                tags,
                            )
                            log_activity(
                                conn,
                                st.session_state.get("actor", ""),
                                "update",
                                int(document_id),
                                project.get("file_name", ""),
                                f"Saved personal review by {personal_review['reviewer_name']}: {decision}",
                            )
                            conn.commit()
                            st.success(labels["team"]["review_saved"])
                            st.rerun()

            review = get_project_review(conn, int(document_id))
            with st.form(f"review-form-{document_id}"):
                st.markdown(f"**{labels['review']['title']}**")
                review_cols = st.columns([1, 1, 2])
                current_status_label = review_status_label(review["review_status"], lang)
                status_options = labels["review"]["options"]
                status_index = status_options.index(current_status_label) if current_status_label in status_options else 0
                selected_status_label = review_cols[0].selectbox(
                    labels["review"]["status"],
                    status_options,
                    index=status_index,
                )
                owner = review_cols[1].text_input(labels["review"]["owner"], value=review["owner"])
                note = review_cols[2].text_input(labels["review"]["note"], value=review["note"])
                if st.form_submit_button(labels["review"]["save"]):
                    save_project_review(
                        conn,
                        int(document_id),
                        review_status_value(selected_status_label, lang),
                        owner.strip(),
                        note.strip(),
                    )
                    log_activity(
                        conn,
                        st.session_state.get("actor", ""),
                        "update",
                        int(document_id),
                        project.get("file_name", ""),
                        f"Saved team review: {review_status_value(selected_status_label, lang)}",
                    )
                    conn.commit()
                    st.success(labels["review"]["saved"])

            committee_review = get_committee_review(conn, int(document_id))
            st.markdown(f"### {labels['committee']['title']}")
            run_label = labels["committee"]["rerun"] if committee_review else labels["committee"]["run"]
            if st.button(run_label, key=f"committee-{document_id}"):
                with st.spinner(labels["committee"]["running"]):
                    try:
                        chunks = get_project_chunks(conn, int(document_id), limit=16)
                        committee_review = generate_committee_review(display_project, chunks)
                        save_committee_review(conn, int(document_id), committee_review)
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "update",
                            int(document_id),
                            project.get("file_name", ""),
                            f"Saved committee review: {committee_review.get('decision', '')}",
                        )
                        conn.commit()
                        st.success(labels["committee"]["saved"])
                    except Exception as exc:
                        log_activity(
                            conn,
                            st.session_state.get("actor", ""),
                            "failed",
                            int(document_id),
                            project.get("file_name", ""),
                            f"Committee review failed: {exc}",
                        )
                        conn.commit()
                        st.error(f"{'Committee review failed:' if lang == 'en' else '投委会评审失败：'} {exc}")

            if committee_review:
                score_cols = st.columns(2)
                score_cols[0].metric(labels["committee"]["score"], committee_review.get("overall_score", 0))
                score_cols[1].metric(labels["committee"]["decision"], committee_review.get("decision", ""))
                st.markdown(f"**{labels['committee']['summary']}**")
                st.write(committee_review.get("summary", labels["empty"]))

                analyst_rows = committee_review.get("analyst_reviews") or []
                if analyst_rows:
                    st.markdown(f"**{labels['committee']['analysts']}**")
                    st.dataframe(pd.DataFrame(analyst_rows), use_container_width=True, hide_index=True)

                st.markdown(f"**{labels['committee']['red_team']}**")
                st.write(committee_review.get("red_team") or labels["empty"])

                detail_cols = st.columns(3)
                with detail_cols[0]:
                    st.markdown(f"**{labels['committee']['questions']}**")
                    st.write(committee_review.get("key_questions") or labels["none"])
                with detail_cols[1]:
                    st.markdown(f"**{labels['committee']['missing']}**")
                    st.write(committee_review.get("missing_info") or labels["none"])
                with detail_cols[2]:
                    st.markdown(f"**{labels['committee']['next_steps']}**")
                    st.write(committee_review.get("next_steps") or labels["none"])

            cols = st.columns(4)
            cols[0].metric(labels["detail"]["industry"], localized_value(display_project["industry"], labels))
            cols[1].metric(labels["detail"]["ai_related"], labels["yes"] if display_project["ai_related"] else labels["no"])
            cols[2].metric(labels["detail"]["stage"], localized_value(display_project["financing_stage"], labels))
            cols[3].metric(
                labels["detail"]["recommendation"],
                localized_recommendation(display_project["recommendation"], lang),
            )

            st.markdown(f"### {labels['similar']['title']}")
            similar_rows = similar_projects(conn, int(document_id), limit=5)
            if similar_rows:
                st.dataframe(
                    pd.DataFrame(
                        [
                            {
                                labels["columns"]["document_id"]: row["document_id"],
                                labels["columns"]["project"]: row["project_name"],
                                labels["columns"]["industry"]: localized_value(row.get("industry"), labels),
                                labels["columns"]["stage"]: localized_value(row.get("financing_stage"), labels),
                                labels["columns"]["recommendation"]: localized_recommendation(
                                    row.get("recommendation"),
                                    lang,
                                ),
                                labels["similar"]["score"]: round(float(row.get("similarity_score") or 0), 3),
                                labels["columns"]["summary"]: localized_value(row.get("one_line_summary"), labels),
                            }
                            for row in similar_rows
                        ]
                    ),
                    use_container_width=True,
                    hide_index=True,
                )
            else:
                st.info(labels["similar"]["none"])

            st.markdown(f"**{labels['detail']['business_model']}**")
            st.write(localized_value(display_project["business_model"], labels))
            st.markdown(f"**{labels['detail']['team']}**")
            st.write(join_values(display_project["team_highlights"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['traction']}**")
            st.write(join_values(display_project["traction"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['customers']}**")
            st.write(localized_value(display_project["customers_or_users"], labels))
            st.markdown(f"**{labels['detail']['revenue']}**")
            st.write(localized_value(display_project["revenue_or_financials"], labels))
            st.markdown(f"**{labels['detail']['risks']}**")
            st.write(join_values(display_project["risks"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['tags']}**")
            st.write(join_values(display_project["tags"]) or labels["none"])
            st.markdown(f"**{labels['detail']['source']}**")
            st.code(project["file_name"])
            source_path = Path(project["file_path"])
            st.markdown(f"**{labels['detail']['preview']}**")
            if source_path.exists() and source_path.suffix.lower() == ".pdf":
                preview_url = pdf_preview_url(source_path, int(document_id))
                st.markdown(pdf_preview_html(source_path, int(document_id)), unsafe_allow_html=True)
                st.link_button(labels["detail"]["open_new_tab"], preview_url)
                st.download_button(
                    labels["detail"]["open_local"],
                    data=source_path.read_bytes(),
                    file_name=source_path.name,
                    mime="application/pdf",
                    key=f"download-detail-{document_id}",
                )
            else:
                st.info(labels["detail"]["preview_unavailable"])

            if display_project["evidence"]:
                st.markdown(f"**{labels['detail']['evidence']}**")
                evidence_table = pd.DataFrame(
                    [
                        {
                            labels["detail"]["field"]: evidence.get("field", labels["detail"]["field"]),
                            labels["page"]: evidence.get("page") or labels["unknown"],
                            "Quote" if lang == "en" else "原文": evidence.get("quote", ""),
                        }
                        for evidence in display_project["evidence"]
                    ]
                )
                st.dataframe(evidence_table, use_container_width=True, hide_index=True)

            st.markdown(f"### {labels['detail']['agent']}")
            chat_key = f"project_chat_{document_id}"
            st.session_state.setdefault(chat_key, [])
            for message in st.session_state[chat_key]:
                with st.chat_message(message["role"]):
                    st.write(message["content"])

            question = st.chat_input(labels["detail"]["agent_placeholder"], key=f"chat_input_{document_id}")
            if question:
                st.session_state[chat_key].append({"role": "user", "content": question})
                with st.chat_message("user"):
                    st.write(question)
                with st.chat_message("assistant"):
                    with st.spinner(labels["detail"]["agent_thinking"]):
                        try:
                            chunks = get_project_chunks(conn, int(document_id))
                            answer = answer_project_question(project, chunks, question, st.session_state[chat_key][:-1])
                        except Exception as exc:
                            answer = f"{'Agent failed:' if lang == 'en' else 'Agent 调用失败：'} {exc}"
                        st.write(answer)
                st.session_state[chat_key].append({"role": "assistant", "content": answer})

    with tab_status:
        stats = document_stats(conn)
        cols = st.columns(4)
        cols[0].metric(labels["status"]["total"], stats["total"])
        cols[1].metric(labels["status"]["done"], stats.get("done", 0))
        cols[2].metric(labels["status"]["failed"], stats.get("failed", 0))
        cols[3].metric(labels["status"]["processing"], stats.get("processing", 0))

        docs = document_rows(conn)
        failed_paths = [row["file_path"] for row in docs if row["status"] == "failed" and Path(row["file_path"]).exists()]
        if st.button(labels["status"]["retry_failed"], disabled=not failed_paths):
            if failed_paths:
                with st.spinner(labels["processing"]):
                    ok, failed = retry_failed_documents(failed_paths, use_llm=use_llm)
                log_activity(
                    conn,
                    st.session_state.get("actor", ""),
                    "update",
                    detail=f"Retried failed analyses: {ok} succeeded, {failed} failed",
                )
                conn.commit()
                st.success(labels["status"]["retry_done"].format(ok=ok, failed=failed))
                st.rerun()
            else:
                st.info(labels["status"]["no_failed"])

        st.markdown(f"**{labels['status']['delete_title']}**")
        if docs:
            doc_options = {
                f"{row['id']} · {row['file_name']}": row
                for row in docs
            }
            selected_doc_label = st.selectbox(labels["status"]["delete_select"], list(doc_options.keys()))
            delete_confirm = st.checkbox(labels["status"]["delete_confirm"])
            if st.button(labels["status"]["delete_button"], disabled=not delete_confirm):
                selected_doc = doc_options[selected_doc_label]
                document_id_to_delete = int(selected_doc["id"])
                file_name_to_delete = selected_doc["file_name"]
                delete_document(conn, int(selected_doc["id"]))
                cleanup_pdf_previews(document_id_to_delete)
                log_activity(
                    conn,
                    st.session_state.get("actor", ""),
                    "delete",
                    document_id_to_delete,
                    file_name_to_delete,
                    "Removed from workbench only. Local source file kept.",
                )
                conn.commit()
                if st.session_state.get("document_id") == selected_doc["id"]:
                    st.session_state.pop("document_id", None)
                if st.session_state.get("library_open_document_id") == selected_doc["id"]:
                    st.session_state.pop("library_open_document_id", None)
                st.success(labels["status"]["delete_done"].format(name=file_name_to_delete))
                st.rerun()
        else:
            st.info(labels["status"]["no_documents"])

        st.markdown(f"**{labels['status']['deleted_title']}**")
        deleted_docs = deleted_document_rows(conn)
        if deleted_docs:
            deleted_options = {
                f"{row['id']} · {row['file_name']}": row
                for row in deleted_docs
            }
            selected_deleted_label = st.selectbox(
                labels["status"]["restore_select"],
                list(deleted_options.keys()),
            )
            if st.button(labels["status"]["restore_button"]):
                selected_deleted = deleted_options[selected_deleted_label]
                restore_document(conn, int(selected_deleted["id"]))
                log_activity(
                    conn,
                    st.session_state.get("actor", ""),
                    "restore",
                    int(selected_deleted["id"]),
                    selected_deleted["file_name"],
                    "Restored from soft delete.",
                )
                conn.commit()
                st.success(labels["status"]["restore_done"].format(name=selected_deleted["file_name"]))
                st.rerun()
        else:
            st.info(labels["status"]["no_deleted"])

        st.markdown(f"**{labels['status']['documents']}**")
        docs_table = pd.DataFrame(
            [
                {
                    labels["columns"]["document_id"]: row["id"],
                    labels["columns"]["file"]: row["file_name"],
                    "Status" if lang == "en" else "状态": localized_status(row["status"], lang),
                    labels["columns"]["project"]: row.get("project_name") or labels["empty"],
                    labels["columns"]["industry"]: row.get("industry") or labels["empty"],
                    labels["columns"]["recommendation"]: localized_recommendation(row.get("recommendation"), lang)
                    or labels["empty"],
                    "Error" if lang == "en" else "错误": row.get("error") or "",
                    "Updated" if lang == "en" else "更新时间": row.get("updated_at") or "",
                }
                for row in docs
            ]
        )
        st.dataframe(docs_table, use_container_width=True, hide_index=True)

        st.markdown(f"**{labels['status']['history']}**")
        history_limit = st.number_input(labels["status"]["history_limit"], min_value=20, max_value=1000, value=200, step=20)
        history = activity_rows(conn, limit=int(history_limit))
        if history:
            history_table = pd.DataFrame(
                [
                    {
                        labels["history_columns"]["time"]: row["created_at"],
                        labels["history_columns"]["actor"]: row["actor"],
                        labels["history_columns"]["action"]: row["action"],
                        labels["history_columns"]["document_id"]: row["document_id"] or "",
                        labels["history_columns"]["file"]: row["file_name"],
                        labels["history_columns"]["detail"]: row["detail"],
                    }
                    for row in history
                ]
            )
            st.dataframe(history_table, use_container_width=True, hide_index=True)
        else:
            st.info(labels["status"]["history_empty"])

