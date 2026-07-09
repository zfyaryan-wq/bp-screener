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


st.set_page_config(page_title="BP Screener / BP 快速筛选", layout="wide")
st.title("BP Screener / BP 快速筛选")
st.caption("Lightweight local parsing, structured SQLite profiles, and full-text search. / 本地解析、结构化 SQLite 项目库和全文检索。Storage can be replaced later with Feishu Drive, OSS, COS, or any synced folder. / 后续可替换为飞书云盘、OSS、COS 或任意同步目录。")


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
    st.header("Ingestion / 导入")
    uploads = st.file_uploader(
        "Upload pitch deck files / 上传 BP 文件",
        type=[suffix.lstrip(".") for suffix in SUPPORTED_SUFFIXES],
        accept_multiple_files=True,
    )
    if st.button("Save uploaded files / 保存上传文件", disabled=not uploads):
        saved = save_uploads(uploads)
        st.success(f"Saved {saved} files to {INBOX_DIR} / 已保存 {saved} 个文件到 {INBOX_DIR}")

    use_llm = st.checkbox("Use DeepSeek / Cherry Studio extraction / 使用 DeepSeek / Cherry Studio 抽取", value=True)
    limit = st.number_input("Max files to process in this run / 本次最多处理文件数", min_value=1, max_value=10000, value=20)
    if st.button("Start / continue processing inbox / 开始或继续处理入口目录"):
        with st.spinner("Processing files. This may take a while... / 正在处理文件，请稍候..."):
            ok, failed = ingest_path(INBOX_DIR, use_llm=use_llm, limit=int(limit))
        st.success(f"Processing complete: {ok} succeeded, {failed} failed / 处理完成：成功 {ok}，失败 {failed}")


tab_search, tab_projects, tab_detail = st.tabs(["Search / 检索", "Project Library / 项目库", "Project Detail / 项目详情"])

with connect() as conn:
    with tab_search:
        query = st.text_input("Keyword search / 关键词搜索", placeholder="Examples / 示例：AI healthcare, AI 医疗, embodied intelligence, 具身智能, Series A, A轮")
        if query:
            results = search_chunks(conn, query, limit=50)
            st.write(f"Found {len(results)} source snippets / 找到 {len(results)} 条原文片段")
            for item in results:
                with st.container(border=True):
                    st.markdown(f"**{item['file_name']}** · Page / 第 {item['page'] or 'unknown'} 页")
                    st.write(item["snippet"])
                    if st.button("View project profile / 查看项目档案", key=f"detail-{item['document_id']}-{item['page']}"):
                        st.session_state["document_id"] = item["document_id"]
                        st.rerun()

    with tab_projects:
        col1, col2, col3, col4 = st.columns(4)
        industry = col1.text_input("Industry contains / 行业包含", placeholder="Healthcare / 医疗 / Education / 教育 / Enterprise SaaS")
        stage = col2.text_input("Stage contains / 阶段包含", placeholder="Seed / 种子 / Angel / 天使 / A")
        recommendation = col3.selectbox("Recommendation / 推荐等级", ["", "高", "中", "低", "未知"])
        ai_only = col4.checkbox("AI-related only / 只看 AI 相关")

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
                    "Document ID / 文档ID": row["document_id"],
                    "Project / 项目": row["project_name"],
                    "Company / 公司": row["company_name"],
                    "Industry / 行业": row["industry"],
                    "AI": "Yes / 是" if row["ai_related"] else "No / 否",
                    "AI Category / AI 类型": join_values(row["ai_category"]),
                    "Stage / 阶段": row["financing_stage"],
                    "Business Model / 商业模式": row["business_model"],
                    "Recommendation / 推荐": row["recommendation"],
                    "One-line Summary / 一句话总结": row["one_line_summary"],
                    "File / 文件": row["file_name"],
                }
                for row in rows
            ]
        )
        st.dataframe(table, use_container_width=True, hide_index=True)
        if not table.empty:
            csv = table.to_csv(index=False).encode("utf-8-sig")
            st.download_button("Export CSV / 导出 CSV", csv, "bp_projects.csv", "text/csv")

    with tab_detail:
        document_id = st.number_input(
            "Document ID / 文档ID",
            min_value=1,
            value=int(st.session_state.get("document_id", 1)),
            step=1,
        )
        project = get_project(conn, int(document_id))
        if not project:
            st.info("No project found for this document ID. Ingest files first, or open a profile from search results. / 未找到该文档 ID。请先导入文件，或从检索结果进入。")
        else:
            st.subheader(project["project_name"])
            st.write(project["one_line_summary"])
            cols = st.columns(4)
            cols[0].metric("Industry / 行业", project["industry"])
            cols[1].metric("AI-related / AI 相关", "Yes / 是" if project["ai_related"] else "No / 否")
            cols[2].metric("Financing Stage / 融资阶段", project["financing_stage"])
            cols[3].metric("Recommendation / 推荐", project["recommendation"])

            st.markdown("**Business Model / 商业模式**")
            st.write(project["business_model"])
            st.markdown("**Team Highlights / 团队亮点**")
            st.write(join_values(project["team_highlights"]) or "未知")
            st.markdown("**Traction / 当前进展**")
            st.write(join_values(project["traction"]) or "未知")
            st.markdown("**Customers / Users / 客户或用户**")
            st.write(project["customers_or_users"])
            st.markdown("**Revenue / Financials / 收入或财务**")
            st.write(project["revenue_or_financials"])
            st.markdown("**Risks / 风险**")
            st.write(join_values(project["risks"]) or "未知")
            st.markdown("**Tags / 标签**")
            st.write(join_values(project["tags"]) or "无")
            st.markdown("**Source File Path / 原文件路径**")
            st.code(project["file_path"])

            if project["evidence"]:
                st.markdown("**Evidence / 原文证据**")
                for evidence in project["evidence"]:
                    st.write(f"- {evidence.get('field', 'Field / 字段')} · Page / 第 {evidence.get('page') or 'unknown'} 页: {evidence.get('quote', '')}")

