from __future__ import annotations

import json

from bp_screener.config import LLM_MAX_TOKENS
from bp_screener.llm_client import chat_completion
from bp_screener.llm_json import loads_llm_json


def generate_committee_review(project: dict, chunks: list[dict] | None = None) -> dict:
    snippets = [
        {
            "page": chunk.get("page"),
            "content": chunk.get("content", "")[:1500],
        }
        for chunk in (chunks or [])[:10]
    ]
    response = chat_completion(
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI investment committee for a four-person student BP review team. "
                    "Review startup pitch decks with multiple analyst roles. Be evidence-based, skeptical, "
                    "and useful for deciding whether the team should spend time on follow-up. "
                    "Do not invent facts. If evidence is missing, say so. Return valid JSON only."
                ),
            },
            {
                "role": "user",
                "content": (
                    "Run a multi-agent committee review for this BP.\n\n"
                    "Return JSON with exactly these keys:\n"
                    "overall_score: integer 0-100;\n"
                    "decision: one of Priority, Discuss, Pass, Reject, More info needed;\n"
                    "summary: concise final committee view;\n"
                    "analyst_reviews: array of objects with role, score, view, evidence, concerns. "
                    "Roles must include Market Analyst, Product Analyst, AI Analyst, Team Analyst, "
                    "Traction Analyst, Risk Analyst;\n"
                    "red_team: skeptical critique of why this project may fail or be overstated;\n"
                    "key_questions: array of questions to ask the founder;\n"
                    "missing_info: array of important missing data;\n"
                    "next_steps: array of recommended actions for our team.\n\n"
                    "Scoring guidance: 80-100 Priority, 60-79 Discuss, 40-59 More info needed, "
                    "20-39 Pass, 0-19 Reject.\n\n"
                    f"Structured profile:\n{json.dumps(project, ensure_ascii=False)}\n\n"
                    f"Source snippets:\n{json.dumps(snippets, ensure_ascii=False)}"
                ),
            },
        ],
        temperature=0.15,
        max_tokens=min(LLM_MAX_TOKENS, 4096),
        response_format={"type": "json_object"},
    )
    review = loads_llm_json(response.choices[0].message.content)
    review["overall_score"] = max(0, min(100, int(review.get("overall_score") or 0)))
    allowed_decisions = {"Priority", "Discuss", "Pass", "Reject", "More info needed"}
    decision = str(review.get("decision") or "More info needed").strip()
    if decision not in allowed_decisions:
        score = review["overall_score"]
        if score >= 80:
            decision = "Priority"
        elif score >= 60:
            decision = "Discuss"
        elif score >= 40:
            decision = "More info needed"
        elif score >= 20:
            decision = "Pass"
        else:
            decision = "Reject"
    review["decision"] = decision
    for key in ["analyst_reviews", "key_questions", "missing_info", "next_steps"]:
        if not isinstance(review.get(key), list):
            review[key] = []
    review["summary"] = str(review.get("summary") or "")
    review["red_team"] = str(review.get("red_team") or "")
    return review
