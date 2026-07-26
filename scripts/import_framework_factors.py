from __future__ import annotations

import argparse
import json
import re
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

from bp_screener.config import FEISHU_BP_FOLDER_TOKEN
from bp_screener.feishu import FeishuApiError, FeishuClient, FeishuFile


XLSX_NS = {
    "m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}

DEFAULT_FILES = {
    "A": Path(
        r"C:\Users\zfyar\Documents\xwechat_files\wxid_owxsuyj1onyd21_4899\msg\file\2026-07\Type_A_Company_Evaluation_Framework.xlsx"
    ),
    "B": Path(
        r"C:\Users\zfyar\Documents\xwechat_files\wxid_owxsuyj1onyd21_4899\msg\file\2026-07\Type_B_Company_Evaluation_Framework.xlsx"
    ),
    "C": Path(
        r"C:\Users\zfyar\Documents\xwechat_files\wxid_owxsuyj1onyd21_4899\msg\file\2026-07\Type_C_Company_Evaluation_Framework.xlsx"
    ),
}

CATEGORY_BY_VARIABLE = {
    "team quality": "founder_team",
    "product quality/clarity": "product_technology",
    "product urgency/need": "product_technology",
    "business model/clarity of unit economics": "business_customer",
    "proof of market validation": "business_customer",
    "market saturation": "market_industry",
    "growth potential": "market_industry",
    "competitive moat": "market_industry",
    "international scalability": "market_industry",
    "capex constraints": "financial",
    "investment feasibility": "financial",
    "regulatory risk": "risk",
    "foreign investor complication": "risk",
    "ease of due diligence": "risk",
    "project coherence": "overall_fit",
    "fit with our investment thesis": "overall_fit",
    "investment attractiveness": "overall_fit",
}


@dataclass
class FrameworkRow:
    framework_type: str
    sheet: str
    row_number: int
    variable: str
    weighted_score: int
    score: str
    points_awarded: str
    total_score: int
    pass_threshold: str
    source_file: Path
    feishu_file: FeishuFile
    upload_error: str = ""

    @property
    def key(self) -> str:
        variable_key = re.sub(r"[^a-z0-9]+", "_", self.variable.lower()).strip("_")
        return f"framework_type_{self.framework_type.lower()}_{variable_key}"[:64]

    @property
    def category(self) -> str:
        return CATEGORY_BY_VARIABLE.get(self.variable.lower(), "overall_fit")


def col_index(cell_ref: str) -> int:
    letters = "".join(ch for ch in cell_ref if ch.isalpha())
    index = 0
    for ch in letters:
        index = index * 26 + ord(ch.upper()) - 64
    return index - 1


def node_text(element: ET.Element) -> str:
    return "".join(node.text or "" for node in element.findall(".//m:t", XLSX_NS))


def parse_xlsx(path: Path) -> list[dict[str, object]]:
    with zipfile.ZipFile(path) as archive:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in archive.namelist():
            root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            shared_strings = [node_text(item) for item in root.findall("m:si", XLSX_NS)]

        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        targets = {rel.attrib["Id"]: rel.attrib["Target"] for rel in relationships.findall("rel:Relationship", XLSX_NS)}

        sheets: list[dict[str, object]] = []
        for sheet in workbook.findall("m:sheets/m:sheet", XLSX_NS):
            sheet_name = sheet.attrib["name"]
            rel_id = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = targets[rel_id]
            sheet_path = "xl/" + target.lstrip("/") if not target.startswith("xl/") else target
            root = ET.fromstring(archive.read(sheet_path))
            rows: list[tuple[int, list[str]]] = []
            for row in root.findall("m:sheetData/m:row", XLSX_NS):
                values: list[str] = []
                for cell in row.findall("m:c", XLSX_NS):
                    idx = col_index(cell.attrib.get("r", "A"))
                    while len(values) <= idx:
                        values.append("")
                    value = cell.find("m:v", XLSX_NS)
                    inline = cell.find("m:is", XLSX_NS)
                    text = ""
                    if cell.attrib.get("t") == "s" and value is not None and value.text is not None:
                        shared_index = int(value.text)
                        text = shared_strings[shared_index] if shared_index < len(shared_strings) else ""
                    elif cell.attrib.get("t") == "inlineStr" and inline is not None:
                        text = node_text(inline)
                    elif value is not None and value.text is not None:
                        text = value.text
                    values[idx] = str(text).strip()
                if any(values):
                    rows.append((int(row.attrib.get("r", len(rows) + 1)), values))
            sheets.append({"name": sheet_name, "rows": rows})
        return sheets


def parse_framework(path: Path, framework_type: str, feishu_file: FeishuFile) -> list[FrameworkRow]:
    if not path.exists():
        raise FileNotFoundError(path)
    sheets = parse_xlsx(path)
    factors: list[FrameworkRow] = []
    for sheet in sheets:
        rows = sheet["rows"]
        sheet_name = str(sheet["name"])
        header_index = next(
            (index for index, (_, row) in enumerate(rows) if row and row[0].lower() == "variable"),
            None,
        )
        if header_index is None:
            continue
        total_score = 0
        pass_threshold = ""
        for _, row in rows[header_index + 1 :]:
            first_cell = row[0] if row else ""
            if first_cell.lower() == "total score":
                total_score = int(float(row[1])) if len(row) > 1 and row[1] else 0
            elif first_cell.lower().startswith("pass threshold"):
                pass_threshold = first_cell
        for row_number, row in rows[header_index + 1 :]:
            if len(row) < 2 or row[0].lower() in {"total score", "final verdict"} or row[0].lower().startswith("pass threshold"):
                continue
            factors.append(
                FrameworkRow(
                    framework_type=framework_type,
                    sheet=sheet_name,
                    row_number=row_number,
                    variable=row[0],
                    weighted_score=int(float(row[1])),
                    score=row[2] if len(row) > 2 else "",
                    points_awarded=row[3] if len(row) > 3 else "",
                    total_score=total_score,
                    pass_threshold=pass_threshold,
                    source_file=path,
                    feishu_file=feishu_file,
                )
            )
    return factors


def sql_quote(value: object) -> str:
    return "'" + str(value).replace("'", "''") + "'"


def factor_payload(row: FrameworkRow) -> dict[str, object]:
    source_url = row.feishu_file.url
    name = {
        "en": f"Type {row.framework_type} - {row.variable}",
        "zh": f"Type {row.framework_type} - {row.variable}",
    }
    description = {
        "en": (
            f"Imported from the Type {row.framework_type} company evaluation framework. "
            f"Weighted score: {row.weighted_score}/{row.total_score}. "
            "Use a 1-5 score where 1=0%, 2=25%, 3=50%, 4=75%, 5=100% of this variable's weight. "
            f"{row.pass_threshold}"
        ).strip(),
        "zh": (
            f"来自 Type {row.framework_type} 公司评价框架。"
            f"该项权重分：{row.weighted_score}/{row.total_score}。"
            "评分按 1-5 映射：1=0%、2=25%、3=50%、4=75%、5=100% 的该项权重。"
            f"{row.pass_threshold}"
        ).strip(),
    }
    metadata = {
        "rule": {
            "type": "semantic_keyword",
            "field": "one_line_summary",
            "keywords": [row.variable],
        },
        "source": f"Type {row.framework_type} framework",
        "framework_type": f"Type {row.framework_type}",
        "source_file": row.source_file.name,
        "source_url": source_url,
        "file_url": source_url,
        "file_token": row.feishu_file.token,
        "upload_error": row.upload_error,
        "sheet": row.sheet,
        "row": row.row_number,
        "weighted_score": row.weighted_score,
        "score_scale": "1=0%, 2=25%, 3=50%, 4=75%, 5=100%",
        "total_possible_score": row.total_score,
        "pass_threshold": row.pass_threshold,
    }
    return {
        "key": row.key,
        "name": name,
        "description": description,
        "category": row.category,
        "scope": "public",
        "owner": "System",
        "source_prompt": f"Imported from {row.source_file.name}",
        "metadata": metadata,
    }


def write_sql(factors: list[dict[str, object]], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    keys = [str(factor["key"]) for factor in factors]
    statements = [
        "-- Generated by scripts/import_framework_factors.py",
        f"DELETE FROM weight_factors WHERE key IN ({', '.join(sql_quote(key) for key in keys)});",
    ]
    for factor in factors:
        statements.append(
            "INSERT INTO weight_factors(key, name, description, category, scope, owner, source_prompt, metadata_json, created_at, updated_at) "
            "VALUES ("
            + ", ".join(
                [
                    sql_quote(factor["key"]),
                    sql_quote(json.dumps(factor["name"], ensure_ascii=False)),
                    sql_quote(json.dumps(factor["description"], ensure_ascii=False)),
                    sql_quote(factor["category"]),
                    "'public'",
                    sql_quote(factor["owner"]),
                    sql_quote(factor["source_prompt"]),
                    sql_quote(json.dumps(factor["metadata"], ensure_ascii=False)),
                    "CURRENT_TIMESTAMP",
                    "CURRENT_TIMESTAMP",
                ]
            )
            + ");"
        )
    output.write_text("\n".join(statements) + "\n", encoding="utf-8")


def main() -> None:
    load_dotenv(ROOT / ".env")
    parser = argparse.ArgumentParser(description="Upload evaluation frameworks and import them as public weight factors.")
    parser.add_argument("--folder-token", default=FEISHU_BP_FOLDER_TOKEN)
    parser.add_argument("--json-output", type=Path, default=ROOT / "data" / "framework_factors.json")
    parser.add_argument("--sql-output", type=Path, default=ROOT / "data" / "framework_factors_import.sql")
    parser.add_argument("--allow-upload-failure", action="store_true")
    args = parser.parse_args()

    if not args.folder_token:
        raise SystemExit("FEISHU_BP_FOLDER_TOKEN is not configured.")

    client = FeishuClient()
    all_rows: list[FrameworkRow] = []
    uploads: dict[str, dict[str, str]] = {}
    for framework_type, path in DEFAULT_FILES.items():
        if not path.exists():
            raise SystemExit(f"Excel file not found: {path}")
        upload_error = ""
        try:
            feishu_file = client.upload_file(path, args.folder_token)
        except FeishuApiError as exc:
            if not args.allow_upload_failure:
                raise
            upload_error = str(exc)
            feishu_file = FeishuFile(token="", name=path.name, type=path.suffix.lstrip("."), url="", parent_token=args.folder_token)
        uploads[framework_type] = {
            "name": feishu_file.name,
            "token": feishu_file.token,
            "url": feishu_file.url,
            "error": upload_error,
        }
        rows = parse_framework(path, framework_type, feishu_file)
        for row in rows:
            row.upload_error = upload_error
        all_rows.extend(rows)

    factors = [factor_payload(row) for row in all_rows]
    args.json_output.parent.mkdir(parents=True, exist_ok=True)
    args.json_output.write_text(
        json.dumps({"uploads": uploads, "factor_count": len(factors), "factors": factors}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    write_sql(factors, args.sql_output)

    print(json.dumps({"uploads": uploads, "factor_count": len(factors), "sql_output": str(args.sql_output)}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
