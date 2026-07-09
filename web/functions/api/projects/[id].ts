import { Env, jsonResponse, normalizeProject } from "../_utils";

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return jsonResponse({ error: "Invalid project id" }, { status: 400 });
  }

  const project = await env.DB.prepare(`
    SELECT
      p.*,
      d.file_name,
      d.source_url
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    WHERE p.document_id = ?
  `).bind(id).first();

  if (!project) {
    return jsonResponse({ error: "Project not found" }, { status: 404 });
  }

  const chunks = await env.DB.prepare(`
    SELECT page, chunk_index, content
    FROM chunks
    WHERE document_id = ?
    ORDER BY chunk_index ASC
    LIMIT 20
  `).bind(id).all();

  return jsonResponse({
    project: normalizeProject(project as Record<string, unknown>),
    chunks: chunks.results || [],
  });
};
