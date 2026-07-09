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


LABELS = {
    "en": {
        "page_title": "BP Screener",
        "caption": "Lightweight local parsing, structured SQLite profiles, and full-text search. Storage can be replaced later with Feishu Drive, OSS, COS, or any synced folder.",
        "language": "Language",
        "ingestion": "Ingestion",
        "upload": "Upload pitch deck files",
        "save": "Save uploaded files",
        "saved": "Saved {saved} files to {path}",
        "use_llm": "Use DeepSeek / Cherry Studio extraction",
        "limit": "Max files to process in this run",
        "process": "Start / continue processing inbox",
        "processing": "Processing files. This may take a while...",
        "processed": "Processing complete: {ok} succeeded, {failed} failed",
        "tabs": ["Search", "Project Library", "Project Detail"],
        "keyword": "Keyword search",
        "keyword_placeholder": "Examples: AI healthcare, embodied intelligence, Series A",
        "found": "Found {count} source snippets",
        "page": "Page",
        "unknown": "unknown",
        "view_profile": "View project profile",
        "industry_filter": "Industry contains",
        "industry_placeholder": "Healthcare / Education / Enterprise SaaS",
        "stage_filter": "Stage contains",
        "stage_placeholder": "Seed / Angel / A",
        "recommendation": "Recommendation",
        "ai_only": "AI-related only",
        "export": "Export CSV",
        "no_project": "No project found for this document ID. Ingest files first, or open a profile from search results.",
        "columns": {
            "document_id": "Document ID",
            "project": "Project",
            "company": "Company",
            "industry": "Industry",
            "ai_category": "AI Category",
            "stage": "Stage",
            "business_model": "Business Model",
            "recommendation": "Recommendation",
            "summary": "One-line Summary",
            "file": "File",
        },
        "yes": "Yes",
        "no": "No",
        "detail": {
            "industry": "Industry",
            "ai_related": "AI-related",
            "stage": "Financing Stage",
            "recommendation": "Recommendation",
            "business_model": "Business Model",
            "team": "Team Highlights",
            "traction": "Traction",
            "customers": "Customers / Users",
            "revenue": "Revenue / Financials",
            "risks": "Risks",
            "tags": "Tags",
            "source": "Source File Path",
            "evidence": "Evidence",
            "field": "Field",
        },
        "empty": "unknown",
        "none": "none",
    },
    "zh": {
        "page_title": "BP 快速筛选",
        "caption": "轻量版：本地解析、结构化 SQLite 项目库和全文检索。存储层后续可替换为飞书云盘、OSS、COS 或任意同步目录。",
        "language": "语言",
        "ingestion": "导入",
        "upload": "上传 BP 文件",
        "save": "保存上传文件",
        "saved": "已保存 {saved} 个文件到 {path}",
        "use_llm": "使用 DeepSeek / Cherry Studio 抽取",
        "limit": "本次最多处理文件数",
        "process": "开始或继续处理入口目录",
        "processing": "正在处理文件，请稍候...",
        "processed": "处理完成：成功 {ok}，失败 {failed}",
        "tabs": ["检索", "项目库", "项目详情"],
        "keyword": "关键词搜索",
        "keyword_placeholder": "示例：AI 医疗、具身智能、A轮、年收入",
        "found": "找到 {count} 条原文片段",
        "page": "第",
        "unknown": "未知",
        "view_profile": "查看项目档案",
        "industry_filter": "行业包含",
        "industry_placeholder": "医疗 / 教育 / 企业服务",
        "stage_filter": "阶段包含",
        "stage_placeholder": "种子 / 天使 / A",
        "recommendation": "推荐等级",
        "ai_only": "只看 AI 相关",
        "export": "导出 CSV",
        "no_project": "未找到该文档 ID。请先导入文件，或从检索结果进入。",
        "columns": {
            "document_id": "文档ID",
            "project": "项目",
            "company": "公司",
            "industry": "行业",
            "ai_category": "AI 类型",
            "stage": "阶段",
            "business_model": "商业模式",
            "recommendation": "推荐",
            "summary": "一句话总结",
            "file": "文件",
        },
        "yes": "是",
        "no": "否",
        "detail": {
            "industry": "行业",
            "ai_related": "AI 相关",
            "stage": "融资阶段",
            "recommendation": "推荐",
            "business_model": "商业模式",
            "team": "团队亮点",
            "traction": "当前进展",
            "customers": "客户或用户",
            "revenue": "收入或财务",
            "risks": "风险",
            "tags": "标签",
            "source": "原文件路径",
            "evidence": "原文证据",
            "field": "字段",
        },
        "empty": "未知",
        "none": "无",
    },
}


st.set_page_config(page_title="BP Screener", layout="wide")


def join_values(value: list | str | None) -> str:
    if isinstance(value, list):
        return ", ".join(str(item) for item in value)
    return value or ""


def localized_page(page: int | None, labels: dict) -> str:
    if labels["page"] == "第":
        return f"第 {page or labels['unknown']} 页"
    return f"Page {page or labels['unknown']}"


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
    language = st.selectbox("Language", ["English", "中文"])
    lang = "zh" if language == "中文" else "en"
    labels = LABELS[lang]

st.title(labels["page_title"])
st.caption(labels["caption"])

with st.sidebar:
    st.header(labels["ingestion"])
    uploads = st.file_uploader(
        labels["upload"],
        type=[suffix.lstrip(".") for suffix in SUPPORTED_SUFFIXES],
        accept_multiple_files=True,
    )
    if st.button(labels["save"], disabled=not uploads):
        saved = save_uploads(uploads)
        st.success(labels["saved"].format(saved=saved, path=INBOX_DIR))

    use_llm = st.checkbox(labels["use_llm"], value=True)
    limit = st.number_input(labels["limit"], min_value=1, max_value=10000, value=20)
    if st.button(labels["process"]):
        with st.spinner(labels["processing"]):
            ok, failed = ingest_path(INBOX_DIR, use_llm=use_llm, limit=int(limit))
        st.success(labels["processed"].format(ok=ok, failed=failed))


tab_search, tab_projects, tab_detail = st.tabs(labels["tabs"])

with connect() as conn:
    with tab_search:
        query = st.text_input(labels["keyword"], placeholder=labels["keyword_placeholder"])
        if query:
            results = search_chunks(conn, query, limit=50)
            st.write(labels["found"].format(count=len(results)))
            for item in results:
                with st.container(border=True):
                    st.markdown(f"**{item['file_name']}** · {localized_page(item['page'], labels)}")
                    st.write(item["snippet"])
                    if st.button(labels["view_profile"], key=f"detail-{item['document_id']}-{item['page']}"):
                        st.session_state["document_id"] = item["document_id"]
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
                    labels["columns"]["document_id"]: row["document_id"],
                    labels["columns"]["project"]: row["project_name"],
                    labels["columns"]["company"]: row["company_name"],
                    labels["columns"]["industry"]: row["industry"],
                    "AI": labels["yes"] if row["ai_related"] else labels["no"],
                    labels["columns"]["ai_category"]: join_values(row["ai_category"]),
                    labels["columns"]["stage"]: row["financing_stage"],
                    labels["columns"]["business_model"]: row["business_model"],
                    labels["columns"]["recommendation"]: row["recommendation"],
                    labels["columns"]["summary"]: row["one_line_summary"],
                    labels["columns"]["file"]: row["file_name"],
                }
                for row in rows
            ]
        )
        st.dataframe(table, use_container_width=True, hide_index=True)
        if not table.empty:
            csv = table.to_csv(index=False).encode("utf-8-sig")
            st.download_button(labels["export"], csv, "bp_projects.csv", "text/csv")

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
            st.subheader(project["project_name"])
            st.write(project["one_line_summary"])
            cols = st.columns(4)
            cols[0].metric(labels["detail"]["industry"], project["industry"])
            cols[1].metric(labels["detail"]["ai_related"], labels["yes"] if project["ai_related"] else labels["no"])
            cols[2].metric(labels["detail"]["stage"], project["financing_stage"])
            cols[3].metric(labels["detail"]["recommendation"], project["recommendation"])

            st.markdown(f"**{labels['detail']['business_model']}**")
            st.write(project["business_model"])
            st.markdown(f"**{labels['detail']['team']}**")
            st.write(join_values(project["team_highlights"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['traction']}**")
            st.write(join_values(project["traction"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['customers']}**")
            st.write(project["customers_or_users"])
            st.markdown(f"**{labels['detail']['revenue']}**")
            st.write(project["revenue_or_financials"])
            st.markdown(f"**{labels['detail']['risks']}**")
            st.write(join_values(project["risks"]) or labels["empty"])
            st.markdown(f"**{labels['detail']['tags']}**")
            st.write(join_values(project["tags"]) or labels["none"])
            st.markdown(f"**{labels['detail']['source']}**")
            st.code(project["file_path"])

            if project["evidence"]:
                st.markdown(f"**{labels['detail']['evidence']}**")
                for evidence in project["evidence"]:
                    st.write(f"- {evidence.get('field', labels['detail']['field'])} · {localized_page(evidence.get('page'), labels)}: {evidence.get('quote', '')}")

