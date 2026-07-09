import { Env, jsonResponse, likeTerm, normalizeProject } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const industry = url.searchParams.get("industry");
  const stage = url.searchParams.get("stage");
  const recommendation = url.searchParams.get("recommendation");
  const aiOnly = url.searchParams.get("aiOnly") === "true";

  const conditions: string[] = [];
  const bindings: unknown[] = [];

  if (query) {
    conditions.push(`(
      p.project_name LIKE ? OR
      p.company_name LIKE ? OR
      p.industry LIKE ? OR
      p.business_model LIKE ? OR
      p.one_line_summary LIKE ? OR
      p.tags LIKE ?
    )`);
    bindings.push(...Array(6).fill(likeTerm(query)));
  }

  if (industry) {
    conditions.push("p.industry LIKE ?");
    bindings.push(likeTerm(industry));
  }

  if (stage) {
    conditions.push("p.financing_stage LIKE ?");
    bindings.push(likeTerm(stage));
  }

  if (recommendation) {
    conditions.push("p.recommendation = ?");
    bindings.push(recommendation);
  }

  if (aiOnly) {
    conditions.push("p.ai_related = 1");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await env.DB.prepare(`
    SELECT
      p.*,
      d.file_name,
      d.source_url
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    ${where}
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 200
  `).bind(...bindings).all();

  return jsonResponse({
    projects: (result.results || []).map((row) => normalizeProject(row as Record<string, unknown>)),
  });
};
