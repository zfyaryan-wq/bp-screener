from __future__ import annotations

import altair as alt
import pandas as pd
import streamlit as st

from bp_screener.db import get_committee_review


def clean_chart_value(value: object, labels: dict) -> str:
    if value is None:
        return labels["empty"]
    text = str(value).strip()
    if not text or text in {"未知", "unknown", "None"}:
        return labels["empty"]
    return text


def count_dataframe(values: list[str], labels: dict, top_n: int = 12) -> pd.DataFrame:
    cleaned = [value.strip() for value in values if value and value.strip() and value.strip() != labels["empty"]]
    if not cleaned:
        return pd.DataFrame(columns=["category", "count"])
    counts = pd.Series(cleaned).value_counts().head(top_n).reset_index()
    counts.columns = ["category", "count"]
    return counts


def counts_to_dataframe(rows: list[dict], labels: dict, translate: dict[str, str] | None = None) -> pd.DataFrame:
    data = []
    for row in rows:
        category = str(row.get("category") or labels["empty"])
        if translate:
            category = translate.get(category, category)
        data.append({"category": category, "count": int(row.get("count") or 0)})
    return pd.DataFrame(data, columns=["category", "count"])


def field_count_dataframe(rows: list[dict], field: str, labels: dict, top_n: int = 12) -> pd.DataFrame:
    return count_dataframe([clean_chart_value(row.get(field), labels) for row in rows], labels, top_n=top_n)


def list_field_count_dataframe(rows: list[dict], field: str, labels: dict, top_n: int = 12) -> pd.DataFrame:
    values: list[str] = []
    for row in rows:
        items = row.get(field) or []
        if isinstance(items, list):
            values.extend(str(item) for item in items)
        elif items:
            values.append(str(items))
    return count_dataframe(values, labels, top_n=top_n)


def ai_count_dataframe(rows: list[dict], labels: dict) -> pd.DataFrame:
    values = [labels["yes"] if row.get("ai_related") else labels["no"] for row in rows]
    return count_dataframe(values, labels, top_n=2)


def committee_decision_dataframe(conn, rows: list[dict], labels: dict) -> pd.DataFrame:
    values = []
    for row in rows:
        decision = row.get("committee_decision")
        if decision is None:
            review = get_committee_review(conn, int(row["document_id"]))
            decision = review.get("decision") if review else None
        values.append(decision or labels["committee"]["not_run"])
    return count_dataframe(values, labels, top_n=8)


def committee_score_band_dataframe(conn, rows: list[dict], labels: dict) -> pd.DataFrame:
    values = []
    for row in rows:
        raw_score = row.get("committee_score")
        if raw_score in (None, ""):
            review = get_committee_review(conn, int(row["document_id"]))
            raw_score = review.get("overall_score") if review else None
        if raw_score in (None, ""):
            values.append(labels["committee"]["not_run"])
            continue
        score = int(raw_score or 0)
        if score >= 80:
            values.append("80-100")
        elif score >= 60:
            values.append("60-79")
        elif score >= 40:
            values.append("40-59")
        elif score >= 20:
            values.append("20-39")
        else:
            values.append("0-19")
    return count_dataframe(values, labels, top_n=8)


def render_bar_chart(data: pd.DataFrame, title: str, labels: dict) -> None:
    st.markdown(f"**{title}**")
    if data.empty:
        st.info(labels["analytics"]["no_data"])
        return
    chart = (
        alt.Chart(data)
        .mark_bar(cornerRadiusTopLeft=4, cornerRadiusTopRight=4)
        .encode(
            x=alt.X("count:Q", title=labels["analytics"]["count"]),
            y=alt.Y("category:N", sort="-x", title=labels["analytics"]["category"]),
            tooltip=[
                alt.Tooltip("category:N", title=labels["analytics"]["category"]),
                alt.Tooltip("count:Q", title=labels["analytics"]["count"]),
            ],
            color=alt.Color("category:N", legend=None),
        )
        .properties(height=max(220, min(420, len(data) * 34)))
    )
    st.altair_chart(chart, use_container_width=True)


def render_donut_chart(data: pd.DataFrame, title: str, labels: dict) -> None:
    st.markdown(f"**{title}**")
    if data.empty:
        st.info(labels["analytics"]["no_data"])
        return
    chart = (
        alt.Chart(data)
        .mark_arc(innerRadius=58, outerRadius=105)
        .encode(
            theta=alt.Theta("count:Q", title=labels["analytics"]["count"]),
            color=alt.Color("category:N", title=labels["analytics"]["category"]),
            tooltip=[
                alt.Tooltip("category:N", title=labels["analytics"]["category"]),
                alt.Tooltip("count:Q", title=labels["analytics"]["count"]),
            ],
        )
        .properties(height=280)
    )
    st.altair_chart(chart, use_container_width=True)


def unique_industries(rows: list[dict], labels: dict) -> list[str]:
    values = sorted({clean_chart_value(row.get("industry"), labels) for row in rows})
    return [value for value in values if value != labels["empty"]]
