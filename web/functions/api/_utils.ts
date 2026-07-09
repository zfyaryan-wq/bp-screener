export interface Env {
  DB: D1Database;
}

export function jsonResponse(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...init.headers,
    },
  });
}

export function parseJsonField(value: string | null) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

export function normalizeProject(row: Record<string, unknown>) {
  return {
    ...row,
    ai_related: Boolean(row.ai_related),
    ai_category: parseJsonField(row.ai_category as string | null),
    team_highlights: parseJsonField(row.team_highlights as string | null),
    traction: parseJsonField(row.traction as string | null),
    risks: parseJsonField(row.risks as string | null),
    tags: parseJsonField(row.tags as string | null),
    evidence: parseJsonField(row.evidence as string | null),
  };
}

export function likeTerm(value: string | null) {
  return `%${(value || "").trim()}%`;
}
