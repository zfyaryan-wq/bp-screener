import { Env, jsonResponse, likeTerm } from "./_utils";

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  if (!query?.trim()) {
    return jsonResponse({ snippets: [] });
  }

  const term = likeTerm(query);
  const result = await env.DB.prepare(`
    SELECT
      c.document_id,
      d.file_name,
      c.page,
      c.content
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE c.content LIKE ?
    ORDER BY c.document_id ASC, c.chunk_index ASC
    LIMIT 50
  `).bind(term).all();

  return jsonResponse({
    snippets: (result.results || []).map((row) => {
      const content = String((row as Record<string, unknown>).content || "");
      const index = content.toLowerCase().indexOf(query.toLowerCase());
      const start = index >= 0 ? Math.max(0, index - 80) : 0;
      const end = Math.min(content.length, start + 260);
      return {
        ...(row as Record<string, unknown>),
        snippet: content.slice(start, end),
        content: undefined,
      };
    }),
  });
};
