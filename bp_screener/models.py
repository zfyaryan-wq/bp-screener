from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class Evidence(BaseModel):
    field: str
    quote: str
    page: int | None = None


class ProjectProfile(BaseModel):
    project_name: str = "未知"
    company_name: str = "未知"
    industry: str = "未知"
    ai_related: bool = False
    ai_category: list[str] = Field(default_factory=list)
    financing_stage: str = "未知"
    business_model: str = "未知"
    team_highlights: list[str] = Field(default_factory=list)
    traction: list[str] = Field(default_factory=list)
    customers_or_users: str = "未知"
    revenue_or_financials: str = "未知"
    one_line_summary: str = ""
    recommendation: Literal["高", "中", "低", "未知"] = "未知"
    risks: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    evidence: list[Evidence] = Field(default_factory=list)

