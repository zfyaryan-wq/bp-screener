export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/wake/status") {
      return wakeStatus(env);
    }
    if (url.pathname === "/api/wake/request") {
      return wakeRequest(env);
    }
    if (url.pathname === "/api/wake/heartbeat") {
      const auth = authorizeWakeAgent(request, env);
      if (auth) return auth;
      return wakeHeartbeat(request, env);
    }
    if (isWorkbenchProxyPath(url.pathname)) {
      return proxyWorkbench(request, env);
    }
    if (url.pathname === "/api/projects") {
      const auth = authorizeApi(request, env);
      if (auth) return auth;
      return listProjects(request, env);
    }
    if (url.pathname.startsWith("/api/projects/")) {
      const auth = authorizeApi(request, env);
      if (auth) return auth;
      return getProject(url.pathname.split("/").pop(), env);
    }
    if (url.pathname === "/api/search") {
      const auth = authorizeApi(request, env);
      if (auth) return auth;
      return searchSnippets(request, env);
    }
    if (url.pathname.startsWith("/api/files/")) {
      const auth = authorizeApi(request, env);
      if (auth) return auth;
      return openFile(url.pathname.split("/").pop(), env);
    }
    return env.ASSETS.fetch(request);
  },
};

function isWorkbenchProxyPath(pathname) {
  return (
    pathname === "/workbench" ||
    pathname.startsWith("/workbench/") ||
    pathname.startsWith("/_stcore/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/app/static/") ||
    pathname.startsWith("/media/")
  );
}

async function proxyWorkbench(request, env) {
  await ensureWakeTable(env);
  const state = await env.DB.prepare("SELECT * FROM wake_state WHERE id = 1").first();
  if (state?.status !== "online" || !state?.latest_url || !isRecentTimestamp(state.last_seen_at, 5 * 60 * 1000)) {
    return Response.redirect(new URL("/wake", request.url), 302);
  }

  const sourceUrl = new URL(request.url);
  const targetUrl = new URL(state.latest_url);
  if (sourceUrl.pathname === "/workbench" || sourceUrl.pathname === "/workbench/") {
    targetUrl.pathname = "/";
  } else if (sourceUrl.pathname.startsWith("/workbench/")) {
    targetUrl.pathname = sourceUrl.pathname.slice("/workbench".length) || "/";
  } else {
    targetUrl.pathname = sourceUrl.pathname;
  }
  targetUrl.search = sourceUrl.search;

  return fetch(new Request(targetUrl.toString(), request));
}

function authorizeApi(request, env) {
  const expectedPassword = env.APP_PASSWORD || env.BASIC_AUTH_PASSWORD;
  if (!expectedPassword) {
    return json({ error: "APP_PASSWORD is not configured." }, 500);
  }

  const password = request.headers.get("x-bp-password") || "";
  if (timingSafeEqual(password, expectedPassword)) {
    return null;
  }

  return json({ error: "Invalid password." }, 401);
}

function authorizeWakeAgent(request, env) {
  const expectedToken = env.WAKE_TOKEN || env.APP_PASSWORD || env.BASIC_AUTH_PASSWORD;
  if (!expectedToken) {
    return json({ error: "WAKE_TOKEN or APP_PASSWORD is not configured." }, 500);
  }
  const token = request.headers.get("x-wake-token") || "";
  if (timingSafeEqual(token, expectedToken)) {
    return null;
  }
  return json({ error: "Invalid wake token." }, 401);
}

function timingSafeEqual(left, right) {
  const encoder = new TextEncoder();
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let diff = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    diff |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }
  return diff === 0;
}

async function listProjects(request, env) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const industry = url.searchParams.get("industry");
  const stage = url.searchParams.get("stage");
  const recommendation = url.searchParams.get("recommendation");
  const aiOnly = url.searchParams.get("aiOnly") === "true";
  const conditions = [];
  const bindings = [];

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
    SELECT p.*, d.file_name, d.source_url
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    ${where}
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 200
  `).bind(...bindings).all();

  return json({ projects: (result.results || []).map(normalizeProject) });
}

async function getProject(id, env) {
  const documentId = Number(id);
  if (!Number.isFinite(documentId)) {
    return json({ error: "Invalid project id" }, 400);
  }

  const project = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    WHERE p.document_id = ?
  `).bind(documentId).first();

  if (!project) {
    return json({ error: "Project not found" }, 404);
  }

  const chunks = await env.DB.prepare(`
    SELECT page, chunk_index, content
    FROM chunks
    WHERE document_id = ?
    ORDER BY chunk_index ASC
    LIMIT 20
  `).bind(documentId).all();

  return json({ project: normalizeProject(project), chunks: chunks.results || [] });
}

async function searchSnippets(request, env) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  if (!query?.trim()) {
    return json({ snippets: [] });
  }

  const result = await env.DB.prepare(`
    SELECT c.document_id, d.file_name, c.page, c.content
    FROM chunks c
    JOIN documents d ON d.id = c.document_id
    WHERE c.content LIKE ?
    ORDER BY c.document_id ASC, c.chunk_index ASC
    LIMIT 50
  `).bind(likeTerm(query)).all();

  return json({
    snippets: (result.results || []).map((row) => {
      const content = String(row.content || "");
      const index = content.toLowerCase().indexOf(query.toLowerCase());
      const start = index >= 0 ? Math.max(0, index - 80) : 0;
      return {
        document_id: row.document_id,
        file_name: row.file_name,
        page: row.page,
        snippet: content.slice(start, start + 260),
      };
    }),
  });
}

async function openFile(id, env) {
  if (!env.BP_FILES) {
    return json({ error: "R2 bucket binding BP_FILES is not configured." }, 500);
  }

  const documentId = Number(id);
  if (!Number.isFinite(documentId)) {
    return json({ error: "Invalid document id" }, 400);
  }

  const document = await env.DB.prepare(`
    SELECT file_name, source_url
    FROM documents
    WHERE id = ?
  `).bind(documentId).first();

  if (!document?.source_url) {
    return json({ error: "Source file is not available online yet." }, 404);
  }

  const object = await env.BP_FILES.get(document.source_url);
  if (!object) {
    return json({ error: "Source file object not found." }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("content-type", headers.get("content-type") || contentType(document.file_name));
  headers.set("content-disposition", `inline; filename*=UTF-8''${encodeURIComponent(document.file_name)}`);
  headers.set("cache-control", "private, max-age=300");

  return new Response(object.body, { headers });
}

async function ensureWakeTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS wake_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      requested_at TEXT,
      request_nonce TEXT,
      latest_url TEXT,
      status TEXT NOT NULL DEFAULT 'offline',
      last_seen_at TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  await env.DB.prepare(`
    INSERT OR IGNORE INTO wake_state(id, status, updated_at)
    VALUES (1, 'offline', CURRENT_TIMESTAMP)
  `).run();
}

async function wakeStatus(env) {
  await ensureWakeTable(env);
  const row = await env.DB.prepare("SELECT * FROM wake_state WHERE id = 1").first();
  return json({
    requested_at: row?.requested_at || null,
    request_nonce: row?.request_nonce || null,
    latest_url: row?.latest_url || null,
    status: row?.status || "offline",
    last_seen_at: row?.last_seen_at || null,
    updated_at: row?.updated_at || null,
  });
}

async function wakeRequest(env) {
  await ensureWakeTable(env);
  const current = await env.DB.prepare("SELECT * FROM wake_state WHERE id = 1").first();
  if (current?.status === "online" && isRecentTimestamp(current.last_seen_at, 5 * 60 * 1000)) {
    return json({
      ok: true,
      request_nonce: current.request_nonce,
      status: "online",
      latest_url: current.latest_url || null,
      reused: true,
    });
  }
  if (current?.status === "starting" && isRecentTimestamp(current.updated_at, 60 * 1000)) {
    return json({
      ok: true,
      request_nonce: current.request_nonce,
      status: "starting",
      reused: true,
    });
  }
  const nonce = crypto.randomUUID();
  await env.DB.prepare(`
    UPDATE wake_state
    SET requested_at = CURRENT_TIMESTAMP,
        request_nonce = ?,
        status = 'starting',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).bind(nonce).run();
  return json({ ok: true, request_nonce: nonce, status: "starting" });
}

function isRecentTimestamp(value, maxAgeMs) {
  if (!value) return false;
  const parsed = Date.parse(`${String(value).replace(" ", "T")}Z`);
  if (!Number.isFinite(parsed)) return false;
  return Date.now() - parsed < maxAgeMs;
}

async function wakeHeartbeat(request, env) {
  await ensureWakeTable(env);
  const body = await request.json().catch(() => ({}));
  const latestUrl = String(body.latest_url || "").trim();
  const status = String(body.status || "online").trim();
  const storedUrl = status === "offline" ? "" : latestUrl;
  await env.DB.prepare(`
    UPDATE wake_state
    SET latest_url = CASE
          WHEN ? = 'offline' THEN NULL
          WHEN NULLIF(?, '') IS NOT NULL THEN ?
          ELSE latest_url
        END,
        status = ?,
        last_seen_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).bind(status, storedUrl, storedUrl, status).run();
  return json({ ok: true });
}

function contentType(fileName) {
  const name = String(fileName || "").toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

function normalizeProject(row) {
  return {
    ...row,
    ai_related: Boolean(row.ai_related),
    ai_category: parseJsonField(row.ai_category),
    team_highlights: parseJsonField(row.team_highlights),
    traction: parseJsonField(row.traction),
    risks: parseJsonField(row.risks),
    tags: parseJsonField(row.tags),
    evidence: parseJsonField(row.evidence),
  };
}

function parseJsonField(value) {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

function likeTerm(value) {
  return `%${String(value || "").trim()}%`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
