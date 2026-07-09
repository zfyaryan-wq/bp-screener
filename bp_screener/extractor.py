from __future__ import annotations

import json
import re

from openai import OpenAI
from pydantic import ValidationError

from .config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL
from .models import ProjectProfile


SYSTEM_PROMPT = """你是一个早期项目 BP 筛选助手。
请只基于给定 BP 文本抽取信息，不要编造。未知字段填“未知”或空数组。
所有重要判断都尽量给 evidence，quote 必须来自原文，page 如果能从 [第x页] 判断就填写页码。
recommendation 只能是 高 / 中 / 低 / 未知。
输出必须是合法 JSON，不要 Markdown。"""


USER_PROMPT = """请把下面 BP 文本抽取成 JSON，字段如下：
project_name, company_name, industry, ai_related, ai_category, financing_stage,
business_model, team_highlights, traction, customers_or_users, revenue_or_financials,
one_line_summary, recommendation, risks, tags, evidence。

筛选关注点：
1. 项目属于什么领域。
2. 是否与 AI 相关，以及 AI 类型。
3. 团队是否有名校、大厂、科研、连续创业、行业资源等亮点。
4. 当前进展，包括产品阶段、客户、收入、用户、融资阶段。
5. 商业模式和主要风险。

BP 文本：
{text}
"""


def extract_profile(text: str, use_llm: bool = True) -> ProjectProfile:
    if use_llm:
        try:
            return extract_with_llm(text)
        except Exception:
            return heuristic_profile(text)
    return heuristic_profile(text)


def extract_with_llm(text: str) -> ProjectProfile:
    client = OpenAI(base_url=LLM_BASE_URL, api_key=LLM_API_KEY)
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": USER_PROMPT.format(text=text)},
        ],
        temperature=0.1,
        response_format={"type": "json_object"},
    )
    content = response.choices[0].message.content or "{}"
    data = json.loads(content)
    try:
        return ProjectProfile.model_validate(data)
    except ValidationError:
        return ProjectProfile.model_validate(normalize_llm_payload(data))


def normalize_llm_payload(data: dict) -> dict:
    defaults = ProjectProfile().model_dump()
    defaults.update(data)
    for key in ["ai_category", "team_highlights", "traction", "risks", "tags", "evidence"]:
        if isinstance(defaults[key], str):
            defaults[key] = [defaults[key]] if defaults[key] and defaults[key] != "未知" else []
    if defaults["recommendation"] not in {"高", "中", "低", "未知"}:
        defaults["recommendation"] = "未知"
    return defaults


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

