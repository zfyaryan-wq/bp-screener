from __future__ import annotations

import json
import re

from pydantic import ValidationError

from .config import LLM_MAX_TOKENS
from .llm_client import chat_completion
from .models import ProjectProfile
from .llm_json import loads_llm_json


SYSTEM_PROMPT = """You are a BP screening assistant for a four-person student deal-review team.
Extract only what is supported by the provided BP text. Do not invent facts.
Return all structured profile fields in concise professional English, even if the deck is written in Chinese.
Keep evidence.quote in the original source language because it must be a verbatim quote from the deck.
Use "Unknown" for unknown string fields and [] for unknown list fields.
recommendation must be one of: 高 / 中 / 低 / 未知.
The output must be valid JSON only. Do not return Markdown."""


USER_PROMPT = """Extract the BP text below into JSON with these fields:
project_name, company_name, industry, ai_related, ai_category, financing_stage,
business_model, team_highlights, traction, customers_or_users, revenue_or_financials,
one_line_summary, recommendation, risks, tags, evidence。

Screening focus:
1. What industry or sector the project belongs to.
2. Whether it is AI-related, and what type of AI is involved.
3. Whether the team has credible signals such as top universities, big tech, research background, serial entrepreneurship, or industry resources.
4. Current traction, including product stage, customers, revenue, users, and financing stage.
5. Business model, main risks, and whether the project is worth follow-up for a small student review group.

Language rule:
- Structured profile fields should be in English.
- evidence.quote must stay verbatim from the BP source text.
- evidence.field should be in English.
- recommendation must still use 高 / 中 / 低 / 未知 for compatibility.

BP text:
{text}
"""


def extract_profile(text: str, use_llm: bool = True) -> ProjectProfile:
    if use_llm:
        try:
            return extract_with_llm(text)
        except Exception as exc:
            print(f"[LLM fallback] {type(exc).__name__}: {exc}")
            return heuristic_profile(text)
    return heuristic_profile(text)


def extract_with_llm(text: str) -> ProjectProfile:
    response = chat_completion(
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT.format(text=text)},
        ],
        temperature=0.1,
        max_tokens=LLM_MAX_TOKENS,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content or "{}"
    data = loads_llm_json(content)
    try:
        return ProjectProfile.model_validate(data)
    except ValidationError:
        return ProjectProfile.model_validate(normalize_llm_payload(data))


def normalize_llm_payload(data: dict) -> dict:
    defaults = ProjectProfile().model_dump()
    defaults.update(data)

    string_fields = [
        "project_name",
        "company_name",
        "industry",
        "financing_stage",
        "business_model",
        "customers_or_users",
        "revenue_or_financials",
        "one_line_summary",
    ]
    for key in string_fields:
        defaults[key] = normalize_string(defaults.get(key), default="Unknown")

    defaults["ai_related"] = normalize_bool(defaults.get("ai_related"))
    defaults["recommendation"] = normalize_string(defaults.get("recommendation"), default="未知")

    for key in ["ai_category", "team_highlights", "traction", "risks", "tags", "evidence"]:
        defaults[key] = normalize_list(defaults.get(key), key=key)

    if defaults["recommendation"] not in {"高", "中", "低", "未知"}:
        defaults["recommendation"] = "未知"
    return defaults


def normalize_string(value: object, default: str = "未知") -> str:
    if value is None:
        return default
    if isinstance(value, list):
        items = [str(item).strip() for item in value if str(item).strip()]
        return "；".join(items) if items else default
    if isinstance(value, dict):
        items = [f"{key}: {item}" for key, item in value.items() if str(item).strip()]
        return "；".join(items) if items else default
    text = str(value).strip()
    return text if text else default


def normalize_bool(value: object) -> bool:
    if isinstance(value, bool):
        return value
    if value is None:
        return False
    text = str(value).strip().lower()
    return text in {"true", "yes", "y", "1", "是", "相关", "ai", "有"}


def normalize_list(value: object, key: str) -> list:
    if value is None:
        return []
    if isinstance(value, list):
        if key == "evidence":
            return [normalize_evidence(item, index) for index, item in enumerate(value)]
        return [str(item).strip() for item in value if str(item).strip() and str(item).strip() != "未知"]
    if isinstance(value, dict):
        if key == "evidence":
            return [
                normalize_evidence({"field": field, "quote": quote}, index)
                for index, (field, quote) in enumerate(value.items())
            ]
        return [f"{field}: {item}" for field, item in value.items() if str(item).strip()]
    text = str(value).strip()
    if not text or text == "未知":
        return []
    if key == "evidence":
        return [normalize_evidence({"field": "unknown", "quote": text}, 0)]
    return [text]


def normalize_evidence(value: object, index: int) -> dict:
    if isinstance(value, dict):
        field = str(value.get("field") or value.get("name") or f"evidence_{index + 1}")
        quote = str(value.get("quote") or value.get("text") or value.get("content") or value)
        page = extract_page(value.get("page") or quote)
        return {"field": field, "quote": quote, "page": page}
    quote = str(value)
    return {"field": f"evidence_{index + 1}", "quote": quote, "page": extract_page(quote)}


def extract_page(value: object) -> int | None:
    if value is None:
        return None
    if isinstance(value, int):
        return value
    match = re.search(r"(?:第|page\s*)(\d+)", str(value), re.IGNORECASE)
    return int(match.group(1)) if match else None


def heuristic_profile(text: str) -> ProjectProfile:
    compact = re.sub(r"\s+", " ", text)
    ai_keywords = ["AI", "人工智能", "大模型", "AIGC", "智能体", "Agent", "机器学习", "深度学习", "LLM"]
    stage_keywords = ["种子轮", "天使轮", "Pre-A", "A轮", "B轮", "C轮", "战略融资"]
    model_keywords = ["SaaS", "订阅", "平台", "佣金", "硬件", "服务费", "交易", "license", "授权"]

    stage = next((word for word in stage_keywords if word.lower() in compact.lower()), "未知")
    business_model = next((word for word in model_keywords if word.lower() in compact.lower()), "未知")
    ai_related = any(word.lower() in compact.lower() for word in ai_keywords)
    tags = [word for word in ai_keywords + stage_keywords + model_keywords if word.lower() in compact.lower()]

    return ProjectProfile(
        project_name=guess_name(compact),
        company_name="未知",
        industry=guess_industry(compact),
        ai_related=ai_related,
        ai_category=[word for word in ai_keywords if word.lower() in compact.lower()],
        financing_stage=stage,
        business_model=business_model,
        one_line_summary=compact[:160],
        recommendation="未知",
        tags=tags[:12],
    )


def guess_name(text: str) -> str:
    patterns = [
        r"项目名称[:：]\s*([^，。；;\n]{2,40})",
        r"公司名称[:：]\s*([^，。；;\n]{2,40})",
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()
    return "未知"


def guess_industry(text: str) -> str:
    industries = ["医疗", "教育", "金融", "消费", "企业服务", "机器人", "芯片", "新能源", "电商", "游戏", "文娱"]
    found = [industry for industry in industries if industry in text]
    return " / ".join(found[:3]) if found else "未知"

