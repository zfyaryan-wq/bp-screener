from __future__ import annotations


APP_CSS = """
<style>
.stApp {
    background: #f7f8fb;
}
section[data-testid="stSidebar"] {
    background: #ffffff;
    border-right: 1px solid #e5e7eb;
}
.main .block-container {
    max-width: 1280px;
    padding-top: 1rem;
}
.hero-card {
    padding: 26px 30px;
    border-radius: 24px;
    color: white;
    background:
        radial-gradient(circle at top right, rgba(147,197,253,.42), transparent 34%),
        linear-gradient(135deg, #0f172a, #1e3a8a 56%, #2563eb);
    box-shadow: 0 22px 55px rgba(15, 23, 42, .16);
    margin-bottom: 18px;
}
.hero-eyebrow {
    margin: 0 0 10px;
    color: #bfdbfe;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: .12em;
    text-transform: uppercase;
}
.hero-title {
    margin: 0;
    font-size: clamp(34px, 5vw, 56px);
    line-height: 1;
    letter-spacing: -.05em;
    font-weight: 850;
}
.hero-subtitle {
    max-width: 760px;
    margin: 18px 0 0;
    color: #dbeafe;
    font-size: 17px;
    line-height: 1.65;
}
.workflow-strip {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin: 0 0 18px;
}
.workflow-card {
    padding: 16px 18px;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(15, 23, 42, .06);
}
.workflow-card strong {
    display: block;
    color: #0f172a;
    font-size: 15px;
}
.workflow-card span {
    color: #667085;
    font-size: 13px;
}
div[data-testid="stMetric"] {
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    background: white;
    box-shadow: 0 18px 45px rgba(15, 23, 42, .08);
}
div[data-testid="stMetricLabel"] {
    color: #667085;
}
div[data-testid="stTabs"] button {
    font-weight: 700;
}
.stButton > button,
.stDownloadButton > button {
    border: 0;
    border-radius: 14px;
    color: white;
    background: #2563eb;
    font-weight: 750;
    box-shadow: 0 10px 24px rgba(37, 99, 235, .22);
}
.stButton > button:hover,
.stDownloadButton > button:hover {
    color: white;
    background: #1d4ed8;
    border: 0;
}
div[data-testid="stDataFrame"],
div[data-testid="stExpander"],
div[data-testid="stForm"] {
    border-radius: 22px;
    overflow: hidden;
    box-shadow: 0 18px 45px rgba(15, 23, 42, .06);
}
.project-card {
    padding: 18px;
    border: 1px solid #e5e7eb;
    border-radius: 22px;
    background: white;
    box-shadow: 0 18px 45px rgba(15, 23, 42, .08);
    min-height: 210px;
}
.project-card h3 {
    margin: 0 0 8px;
    font-size: 20px;
    letter-spacing: -.02em;
}
.project-card p {
    color: #667085;
    line-height: 1.55;
    font-size: 14px;
}
.pill {
    display: inline-block;
    margin: 4px 6px 4px 0;
    padding: 5px 10px;
    border-radius: 999px;
    color: #1e40af;
    background: #dbeafe;
    font-size: 12px;
    font-weight: 800;
}
.subtle-section {
    color: #667085;
    font-size: 14px;
    margin: -4px 0 14px;
}
@media (max-width: 900px) {
    .workflow-strip {
        grid-template-columns: 1fr;
    }
}
</style>
"""
