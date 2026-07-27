export default {
  async fetch(request, env) {
    try {
    const url = new URL(request.url);
    if (url.pathname === "/api/account/access-code/status") {
      return disabledAccessCodeResponse();
    }
    if (url.pathname === "/api/account/me") {
      const auth = await authenticateRequest(request, env);
      if (auth.error) return auth.error;
      return json(
        { ok: true, session_token: auth.sessionToken || "", expires_in: SESSION_TTL_SECONDS },
        200,
        sessionCookieHeaders(auth.sessionToken),
      );
    }
    if (url.pathname === "/api/account/access-code") {
      return disabledAccessCodeResponse();
    }
    if (url.pathname === "/api/upload") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await uploadBp(request, env);
    }
    if (url.pathname === "/api/wake/status") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await wakeStatus(env);
    }
    if (url.pathname === "/api/wake/request") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await wakeRequest(env);
    }
    if (url.pathname === "/api/wake/heartbeat") {
      const auth = authorizeWakeAgent(request, env);
      if (auth) return auth;
      return await wakeHeartbeat(request, env);
    }
    if (isWorkbenchProxyPath(url.pathname)) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await proxyWorkbench(request, env);
    }
    if (url.pathname === "/api/filter-options") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await listFilterOptions(request, env);
    }
    if (url.pathname === "/api/projects") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await listProjects(request, env);
    }
    if (url.pathname === "/api/review/board") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await reviewBoard(request, env);
    }
    if (url.pathname === "/api/scoring/profile") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await scoringProfile(request, env);
    }
    if (url.pathname === "/api/scoring/queue") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await scoringQueue(request, env);
    }
    if (url.pathname === "/api/scoring/drafts") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await generateScoreDraft(request, env);
    }
    if (url.pathname === "/api/shortlist") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await shortlistItems(request, env);
    }
    if (url.pathname === "/api/nominations") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await weeklyNominations(request, env);
    }
    const nominationVoteMatch = url.pathname.match(/^\/api\/nominations\/(\d+)\/vote$/);
    if (nominationVoteMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await nominationVote(request, Number(nominationVoteMatch[1]), env);
    }
    const contextMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/context$/);
    if (contextMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectContext(request, Number(contextMatch[1]), env);
    }
    const activityMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/activity$/);
    if (activityMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectActivity(request, Number(activityMatch[1]), env);
    }
    const assistantMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/assistant$/);
    if (assistantMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectAssistant(request, Number(assistantMatch[1]), env);
    }
    const scoreReviewMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/score-review$/);
    if (scoreReviewMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectScoreReview(request, Number(scoreReviewMatch[1]), env);
    }
    const marksMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/marks$/);
    if (marksMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectMarks(request, Number(marksMatch[1]), env);
    }
    const likeMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/like$/);
    if (likeMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await projectLike(request, Number(likeMatch[1]), env);
    }
    const similarMatch = url.pathname.match(/^\/api\/projects\/(\d+)\/similar$/);
    if (similarMatch) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await similarProjects(request, Number(similarMatch[1]), env);
    }
    if (url.pathname.startsWith("/api/projects/")) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await getProject(request, url.pathname.split("/").pop(), env);
    }
    if (url.pathname === "/api/search") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await searchSnippets(request, env);
    }
    if (url.pathname === "/api/recommend") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await recommendProjects(request, env);
    }
    if (url.pathname === "/api/compare") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await compareProjects(request, env);
    }
    if (url.pathname === "/api/weight/factors") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await weightFactors(request, env);
    }
    if (url.pathname.startsWith("/api/weight/factors/") && url.pathname !== "/api/weight/factors/ai") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await weightFactorAction(request, url.pathname, env);
    }
    if (url.pathname === "/api/weight/factors/ai") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await generateWeightFactors(request, env);
    }
    if (url.pathname === "/api/weight/profiles") {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await weightProfiles(request, env);
    }
    if (url.pathname.startsWith("/api/weight/profiles/")) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await weightProfileAction(request, url.pathname, env);
    }
    if (url.pathname.startsWith("/api/files/")) {
      const auth = await authorizeApi(request, env);
      if (auth) return auth;
      return await openFile(url.pathname.split("/").pop(), env);
    }
    return await serveAsset(request, env);
    } catch (error) {
      return internalErrorResponse(error, env);
    }
  },
};

async function serveAsset(request, env) {
  const response = await env.ASSETS.fetch(request);
  const url = new URL(request.url);
  if (!response.ok) return response;
  if (url.pathname === "/" || url.pathname === "/index.html" || url.pathname === "/app.js") {
    const headers = new Headers(response.headers);
    headers.set("cache-control", "no-store, max-age=0, must-revalidate");
    headers.set("pragma", "no-cache");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
  return response;
}

const TEAM_USER_META = [
  {
    name: "Alzamora Quan",
    initials: "AQ",
    displayName: "Alzamora Quan",
    className: "avatar-aq",
    colors: {
      bg: "linear-gradient(135deg, #064e3b, #022c22)",
      accent: "#34d399",
      text: "#d1fae5",
      ring: "rgba(52, 211, 153, 0.68)",
      glow: "rgba(52, 211, 153, 0.3)",
    },
  },
  {
    name: "Gary Wang",
    initials: "GW",
    displayName: "Gary Wang",
    className: "avatar-gw",
    colors: {
      bg: "linear-gradient(135deg, #0f766e, #042f2e)",
      accent: "#2dd4bf",
      text: "#ccfbf1",
      ring: "rgba(45, 212, 191, 0.68)",
      glow: "rgba(45, 212, 191, 0.3)",
    },
  },
  {
    name: "brody",
    initials: "B",
    displayName: "brody",
    className: "avatar-brody",
    colors: {
      bg: "linear-gradient(135deg, #854d0e, #3f2e05)",
      accent: "#facc15",
      text: "#fef9c3",
      ring: "rgba(250, 204, 21, 0.68)",
      glow: "rgba(250, 204, 21, 0.28)",
    },
  },
  {
    name: "Luca Viscapi",
    initials: "LV",
    displayName: "Luca Viscapi",
    className: "avatar-lv",
    colors: {
      bg: "linear-gradient(135deg, #075985, #082f49)",
      accent: "#38bdf8",
      text: "#e0f2fe",
      ring: "rgba(56, 189, 248, 0.66)",
      glow: "rgba(56, 189, 248, 0.28)",
    },
  },
  {
    name: "Frank Zhang",
    initials: "FZ",
    displayName: "Frank Zhang",
    className: "avatar-fz",
    colors: {
      bg: "linear-gradient(135deg, #365314, #1a2e05)",
      accent: "#a3e635",
      text: "#ecfccb",
      ring: "rgba(163, 230, 53, 0.68)",
      glow: "rgba(163, 230, 53, 0.3)",
    },
  },
];
const TEAM_MEMBERS = TEAM_USER_META.map((member) => member.name);
const TEAM_MEMBER_ORDER = new Map(TEAM_MEMBERS.map((member, index) => [member, index]));

function teamUserMeta(name) {
  return TEAM_USER_META.find((member) => member.name === name) || null;
}

function compareTeamActors(a, b) {
  const rankDiff = (TEAM_MEMBER_ORDER.get(a) ?? TEAM_MEMBERS.length) - (TEAM_MEMBER_ORDER.get(b) ?? TEAM_MEMBERS.length);
  return rankDiff || String(a || "").localeCompare(String(b || ""));
}

function sortTeamActors(actors = []) {
  return uniqueStrings(actors, actors.length || TEAM_MEMBERS.length).sort(compareTeamActors);
}

function sortTeamActorObjects(items = []) {
  return [...(items || [])].sort((a, b) => compareTeamActors(a?.actor, b?.actor) || String(b?.created_at || "").localeCompare(String(a?.created_at || "")));
}

function teamUserInitials(name) {
  const known = teamUserMeta(name);
  if (known) return known.initials;
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

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

const SESSION_TTL_SECONDS = 8 * 60 * 60;
const DEFAULT_SESSION_SECRET = "bp-screener-team-session-v1";

async function authorizeApi(request, env) {
  const auth = await authenticateRequest(request, env);
  return auth.error || null;
}

async function authenticateRequest(request, env) {
  const allowedUsers = new Set(TEAM_MEMBERS);
  const requestedUser = request.headers.get("x-bp-user") || "";
  const sessionToken = request.headers.get("x-bp-session-token") || cookieValue(request, "bp_session") || "";
  if (sessionToken && allowedUsers.has(requestedUser)) {
    const session = await verifySessionToken(requestedUser, sessionToken, teamSessionSecretsFor(requestedUser, env));
    if (session.ok) return { user: requestedUser, sessionToken };
  }
  if (sessionToken && !allowedUsers.has(requestedUser)) {
    const sessionUser = await userFromSessionToken(sessionToken, env);
    if (sessionUser) return { user: sessionUser, sessionToken };
  }

  if (!allowedUsers.has(requestedUser)) {
    return { error: json({ error: "Choose a valid team member." }, 401) };
  }

  return { user: requestedUser, sessionToken: await createSessionToken(requestedUser, teamSessionSecret(requestedUser, env)) };
}

function disabledAccessCodeResponse() {
  return json({ error: "Personal access codes are disabled." }, 410);
}

function randomHex(byteLength) {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function cookieValue(request, name) {
  const cookie = request.headers.get("cookie") || "";
  const prefix = `${name}=`;
  return cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length) || "";
}

function sessionCookieHeaders(token) {
  if (!token) return {};
  return {
    "set-cookie": `bp_session=${token}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; SameSite=Lax`,
  };
}

function teamSessionSecret(user, env) {
  const configured = String(env.BP_SESSION_SECRET || env.BP_AUTH_SECRET || "");
  const secret = configured || DEFAULT_SESSION_SECRET;
  if (isWeakSessionSecret(secret)) {
    const message = "BP_SESSION_SECRET must be configured to a strong value for production.";
    if (requiresStrongSessionSecret(env)) {
      throw new Error(message);
    }
    console.warn(`${message} Using a local-development fallback.`);
  }
  return `${user}:${secret}`;
}

function teamSessionSecretsFor(user, env) {
  return [teamSessionSecret(user, env)];
}

function isWeakSessionSecret(secret) {
  return !secret || secret === DEFAULT_SESSION_SECRET || secret.length < 24;
}

function requiresStrongSessionSecret(env) {
  const environment = String(env.ENVIRONMENT || env.NODE_ENV || "").toLowerCase();
  const pagesBranch = String(env.CF_PAGES_BRANCH || "").toLowerCase();
  return envFlag(env.BP_REQUIRE_SESSION_SECRET) || environment === "production" || (env.CF_PAGES && pagesBranch === "main");
}

async function userFromSessionToken(token, env) {
  for (const member of TEAM_MEMBERS) {
    const session = await verifySessionToken(member, token, teamSessionSecretsFor(member, env));
    if (session.ok) return member;
  }
  return "";
}

async function createSessionToken(user, secret) {
  const payload = {
    sub: user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: randomHex(8),
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = await hmacSha256(`${user}:${secret}`, encodedPayload);
  return `v1.${encodedPayload}.${signature}`;
}

async function verifySessionToken(user, token, secrets) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !secrets.length) return { ok: false };
  const [, encodedPayload, signature] = parts;
  for (const secret of secrets) {
    const expected = await hmacSha256(`${user}:${secret}`, encodedPayload);
    if (!timingSafeEqual(signature, expected)) continue;
    const payload = safeJsonParse(base64UrlDecode(encodedPayload));
    if (payload?.sub !== user) return { ok: false };
    if (!Number.isFinite(payload?.exp) || payload.exp < Math.floor(Date.now() / 1000)) return { ok: false };
    return { ok: true };
  }
  return { ok: false };
}

async function hmacSha256(secret, value) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToHex(new Uint8Array(signature));
}

function base64UrlEncode(value) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const padded = `${value}${"=".repeat((4 - (value.length % 4)) % 4)}`;
  return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}

const ALLOWED_BP_EXTENSIONS = new Set(["pdf", "ppt", "pptx", "doc", "docx"]);
const DEFAULT_UPLOAD_MAX_BYTES = 20 * 1024 * 1024;
const DEFAULT_FACTOR_WEIGHTS = [40, 25, 18, 11, 6];
const WEIGHT_FACTOR_CATEGORIES = {
  overall_fit: { en: "Overall fit", zh: "综合判断类" },
  financial: { en: "Financial condition", zh: "财务状况类" },
  founder_team: { en: "Founder team", zh: "创始团队类" },
  market_industry: { en: "Market / industry", zh: "市场 / 行业类" },
  product_technology: { en: "Product / technology", zh: "产品 / 技术类" },
  business_customer: { en: "Business model / customers", zh: "商业模式 / 客户类" },
  risk: { en: "Risk", zh: "风险类" },
};
const DEFAULT_WEIGHT_FACTORS = [
  {
    key: "screening_score",
    category: "overall_fit",
    label: { en: "Screening score", zh: "综合筛选分" },
    description: { en: "Prioritize projects with stronger overall BP screening scores.", zh: "优先综合筛选分更高的项目。" },
    rule: { type: "field_score", field: "screening_score" },
  },
  {
    key: "team_score",
    category: "founder_team",
    label: { en: "Team strength", zh: "团队强度" },
    description: { en: "Prioritize founder and team quality.", zh: "优先团队和创始人质量更强的项目。" },
    rule: { type: "field_score", field: "team_score" },
  },
  {
    key: "traction_score",
    category: "business_customer",
    label: { en: "Traction", zh: "业务进展" },
    description: { en: "Prioritize customer, pilot, revenue, and usage traction.", zh: "优先已有客户、试点、收入或使用数据的项目。" },
    rule: { type: "field_score", field: "traction_score" },
  },
  {
    key: "risk_level",
    category: "risk",
    label: { en: "Lower risk", zh: "低风险优先" },
    description: { en: "Prefer projects with lower explicit risk.", zh: "优先明确风险更低的项目。" },
    rule: { type: "enum_score", field: "risk_level", scores: { "低": 100, "中": 55, "高": 10, "未知": 35 } },
  },
  {
    key: "recommendation",
    category: "overall_fit",
    label: { en: "Recommendation", zh: "推荐等级" },
    description: { en: "Prioritize projects already marked as stronger recommendations.", zh: "优先推荐等级更高的项目。" },
    rule: { type: "enum_score", field: "recommendation", scores: { "高": 100, "中": 60, "低": 20, "未知": 35 } },
  },
  {
    key: "ai_related",
    category: "product_technology",
    label: { en: "AI/tech-related", zh: "智能技术相关" },
    description: { en: "Prefer projects related to AI or other intelligent technologies.", zh: "优先与 AI 或其他智能技术相关的项目。" },
    rule: { type: "boolean_score", field: "ai_related", trueScore: 100, falseScore: 20 },
  },
  {
    key: "financing_stage",
    category: "financial",
    label: { en: "Financing stage clarity", zh: "融资阶段清晰" },
    description: { en: "Prefer projects with a clear financing stage.", zh: "优先融资阶段描述清晰的项目。" },
    rule: { type: "known_value", field: "financing_stage" },
  },
  {
    key: "revenue_stage",
    category: "financial",
    label: { en: "Revenue maturity", zh: "收入成熟度" },
    description: { en: "Prefer revenue, paid pilots, or clear monetization progress.", zh: "优先已有收入、付费试点或商业化进展的项目。" },
    rule: { type: "keyword_score", field: "revenue_stage", keywords: ["revenue", "paid", "paying", "收入", "付费", "商业化"] },
  },
  {
    key: "customer_type",
    category: "business_customer",
    label: { en: "Customer type clarity", zh: "客户类型清晰" },
    description: { en: "Prefer projects with a clear customer segment.", zh: "优先客户类型清晰的项目。" },
    rule: { type: "known_value", field: "customer_type" },
  },
  {
    key: "country_or_region",
    category: "market_industry",
    label: { en: "Market geography", zh: "市场地域" },
    description: { en: "Prefer projects with a clear target country or region.", zh: "优先目标国家或地区清晰的项目。" },
    rule: { type: "known_value", field: "country_or_region" },
  },
  {
    key: "industry",
    category: "market_industry",
    label: { en: "Industry focus", zh: "行业聚焦" },
    description: { en: "Prefer projects with a clear industry focus.", zh: "优先行业定位清晰的项目。" },
    rule: { type: "known_value", field: "industry" },
  },
];

async function uploadBp(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  if (!env.DB) {
    return json({ error: "D1 binding DB is not configured." }, 500);
  }

  const maxBytes = uploadMaxBytes(env);
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return json({ error: "Please choose a BP file to upload." }, 400);
  }

  const validationError = validateBpFile(file, maxBytes);
  if (validationError) {
    return json({ error: validationError.message }, validationError.status);
  }

  let feishuFile;
  try {
    feishuFile = await uploadToFeishuDrive(file, env);
  } catch (error) {
    return json({ error: userFacingError(error) }, 502);
  }

  await ensureUploadDocumentColumns(env);
  await ensureIngestJobsTable(env);
  const document = await createUploadedDocument(file, feishuFile, env);
  const ingestJob = await createIngestJob(document, feishuFile, env);
  const warnings = [];
  const bitableResult = await tryCreateBitableRecord(file, feishuFile, request.headers.get("x-bp-user") || "", env);
  if (bitableResult?.warning) {
    warnings.push(bitableResult.warning);
  }
  const wake = await tryWakeAfterUpload(env);
  if (wake?.warning) {
    warnings.push(wake.warning);
  }

  return json({
    ok: true,
    document,
    ingest_job: ingestJob,
    feishu_file: feishuFile,
    wake,
    warnings,
    message: "BP uploaded to Feishu Drive and queued for VRT Agent ingestion.",
  });
}

function validateBpFile(file, maxBytes) {
  const fileName = String(file.name || "").trim();
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  if (!fileName || !ALLOWED_BP_EXTENSIONS.has(extension)) {
    return { status: 400, message: "Unsupported BP file type. Please upload PDF, PPT, PPTX, DOC, or DOCX." };
  }
  if (!file.size || file.size <= 0) {
    return { status: 400, message: "The selected file is empty." };
  }
  if (file.size > maxBytes) {
    return {
      status: 413,
      message: `File is too large. Current limit is ${formatBytes(maxBytes)}; use a smaller BP or route large files through R2/resumable ingestion.`,
    };
  }
  return null;
}

function uploadMaxBytes(env) {
  const configured = Number(env.UPLOAD_MAX_BYTES || env.BP_UPLOAD_MAX_BYTES || 0);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_UPLOAD_MAX_BYTES;
}

async function uploadToFeishuDrive(file, env) {
  if (!env.FEISHU_APP_ID || !env.FEISHU_APP_SECRET || !env.FEISHU_BP_FOLDER_TOKEN) {
    throw new Error("FEISHU_APP_ID, FEISHU_APP_SECRET, and FEISHU_BP_FOLDER_TOKEN must be configured.");
  }

  const token = await getFeishuTenantAccessToken(env);
  const form = new FormData();
  form.set("file_name", file.name);
  form.set("parent_type", "explorer");
  form.set("parent_node", env.FEISHU_BP_FOLDER_TOKEN);
  form.set("size", String(file.size));
  form.set("file", file, file.name);

  const payload = await feishuFetch("/drive/v1/files/upload_all", {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
    body: form,
  });

  const data = payload.data || {};
  const fileToken = String(data.file_token || data.token || "");
  if (!fileToken) {
    throw new Error(`Feishu upload returned no file token: ${JSON.stringify(payload).slice(0, 300)}`);
  }

  const listed = await findFeishuFileInFolder(fileToken, env.FEISHU_BP_FOLDER_TOKEN, token).catch(() => null);
  return {
    token: fileToken,
    name: listed?.name || file.name,
    type: listed?.type || fileExtension(file.name),
    url: listed?.url || "",
    parent_token: env.FEISHU_BP_FOLDER_TOKEN,
  };
}

async function getFeishuTenantAccessToken(env) {
  const payload = await feishuFetch("/auth/v3/tenant_access_token/internal", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: env.FEISHU_APP_ID, app_secret: env.FEISHU_APP_SECRET }),
    authenticated: false,
  });
  const token = String(payload.tenant_access_token || "");
  if (!token) {
    throw new Error(`Could not get Feishu tenant access token: ${JSON.stringify(payload).slice(0, 300)}`);
  }
  return token;
}

async function findFeishuFileInFolder(fileToken, folderToken, tenantAccessToken) {
  let pageToken = "";
  do {
    const params = new URLSearchParams({ folder_token: folderToken, page_size: "200" });
    if (pageToken) params.set("page_token", pageToken);
    const payload = await feishuFetch(`/drive/v1/files?${params.toString()}`, {
      headers: { authorization: `Bearer ${tenantAccessToken}` },
    });
    const data = payload.data || {};
    const item = (data.files || data.items || []).find((candidate) => candidate.token === fileToken);
    if (item) return item;
    pageToken = String(data.next_page_token || "");
    if (!data.has_more) break;
  } while (pageToken);
  return null;
}

async function tryCreateBitableRecord(file, feishuFile, uploadedBy, env) {
  if (!env.FEISHU_BASE_APP_TOKEN || !env.FEISHU_BASE_TABLE_ID) {
    return null;
  }
  try {
    const token = await getFeishuTenantAccessToken(env);
    await feishuFetch(`/bitable/v1/apps/${env.FEISHU_BASE_APP_TOKEN}/tables/${env.FEISHU_BASE_TABLE_ID}/records`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        fields: {
          [env.FEISHU_BASE_FIELD_FILE_NAME || "File Name"]: file.name,
          [env.FEISHU_BASE_FIELD_FILE_TOKEN || "File Token"]: feishuFile.token,
          [env.FEISHU_BASE_FIELD_SOURCE_URL || "Source URL"]: feishuFile.url,
          [env.FEISHU_BASE_FIELD_STATUS || "Status"]: "uploaded",
          [env.FEISHU_BASE_FIELD_UPLOADED_BY || "Uploaded By"]: uploadedBy,
        },
      }),
    });
    return { ok: true };
  } catch (error) {
    return {
      warning:
        `Feishu Drive upload succeeded, but Bitable record creation failed. Check table field names or app permissions. ${userFacingError(error)}`,
    };
  }
}

async function createUploadedDocument(file, feishuFile, env) {
  const result = await env.DB.prepare(`
    INSERT INTO documents (
      file_name,
      source_url,
      file_size,
      source_platform,
      source_external_id,
      status,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?, 'feishu', ?, 'uploaded', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(file.name, feishuFile.url || "", file.size, feishuFile.token).run();
  const insertedId = result.meta?.last_row_id || null;
  const row = insertedId
    ? null
    : await env.DB.prepare(`
        SELECT id
        FROM documents
        WHERE source_platform = 'feishu' AND source_external_id = ?
        ORDER BY id DESC
        LIMIT 1
      `).bind(feishuFile.token).first();

  return {
    id: insertedId || row?.id || null,
    file_name: file.name,
    file_size: file.size,
    source_platform: "feishu",
    source_external_id: feishuFile.token,
    source_url: feishuFile.url || "",
    status: "uploaded",
  };
}

async function createIngestJob(document, feishuFile, env) {
  if (!document.id) {
    throw new Error("Uploaded document id was not returned by D1; cannot queue ingest job.");
  }
  const result = await env.DB.prepare(`
    INSERT INTO ingest_jobs (
      document_id,
      source_platform,
      source_external_id,
      source_url,
      status,
      attempts,
      error_message,
      created_at,
      updated_at,
      claimed_at,
      completed_at
    )
    VALUES (?, 'feishu', ?, ?, 'queued', 0, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, NULL)
    ON CONFLICT(document_id) DO UPDATE SET
      source_platform = excluded.source_platform,
      source_external_id = excluded.source_external_id,
      source_url = excluded.source_url,
      status = CASE
        WHEN ingest_jobs.status IN ('done', 'processing') THEN ingest_jobs.status
        ELSE 'queued'
      END,
      error_message = NULL,
      updated_at = CURRENT_TIMESTAMP,
      claimed_at = CASE
        WHEN ingest_jobs.status IN ('done', 'processing') THEN ingest_jobs.claimed_at
        ELSE NULL
      END,
      completed_at = CASE
        WHEN ingest_jobs.status = 'done' THEN ingest_jobs.completed_at
        ELSE NULL
      END
  `).bind(document.id, feishuFile.token, feishuFile.url || "").run();

  const row = await env.DB.prepare(`
    SELECT id, document_id, source_platform, source_external_id, source_url, status,
           attempts, error_message, created_at, updated_at, claimed_at, completed_at
    FROM ingest_jobs
    WHERE document_id = ?
  `).bind(document.id).first();

  return row || {
    id: result.meta?.last_row_id || null,
    document_id: document.id,
    source_platform: "feishu",
    source_external_id: feishuFile.token,
    source_url: feishuFile.url || "",
    status: "queued",
    attempts: 0,
    error_message: null,
    claimed_at: null,
    completed_at: null,
  };
}

async function ensureUploadDocumentColumns(env) {
  await addColumnIfMissing(env, "documents", "source_platform", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing(env, "documents", "source_external_id", "TEXT NOT NULL DEFAULT ''");
  await addColumnIfMissing(env, "documents", "status", "TEXT NOT NULL DEFAULT 'new'");
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_documents_status_updated ON documents(status, updated_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_documents_source_external ON documents(source_platform, source_external_id)").run();
}

async function ensureIngestJobsTable(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS ingest_jobs (
      id INTEGER PRIMARY KEY,
      document_id INTEGER NOT NULL,
      source_platform TEXT NOT NULL DEFAULT '',
      source_external_id TEXT NOT NULL DEFAULT '',
      source_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'queued',
      attempts INTEGER NOT NULL DEFAULT 0,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      claimed_at TEXT,
      completed_at TEXT,
      UNIQUE(document_id),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_ingest_jobs_status_created ON ingest_jobs(status, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_ingest_jobs_document_id ON ingest_jobs(document_id)").run();
}

async function addColumnIfMissing(env, tableName, columnName, definition) {
  // Transitional runtime DDL: keep existing ensure* calls for availability, but
  // allow production to block opportunistic ALTERs once migrations are enforced.
  if (envFlag(env.STRICT_SCHEMA)) {
    throw new Error(`Runtime schema change blocked by STRICT_SCHEMA: ${tableName}.${columnName}`);
  }
  try {
    await env.DB.prepare(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`).run();
  } catch (error) {
    const message = String(error?.message || error);
    if (!/duplicate column|already exists/i.test(message)) {
      throw error;
    }
  }
}

async function feishuFetch(path, init = {}) {
  const response = await fetch(`https://open.feishu.cn/open-apis${path}`, init);
  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { raw: text };
  }
  if (!response.ok) {
    throw new Error(`Feishu API ${path} failed: ${response.status} ${text.slice(0, 300)}`);
  }
  const code = payload.code ?? 0;
  if (code !== 0 && code !== "0") {
    throw new Error(`Feishu API ${path} returned code=${code}: ${payload.msg || payload.message || text.slice(0, 300)}`);
  }
  return payload;
}

function userFacingError(error) {
  const message = String(error?.message || error || "Unknown error");
  if (/Feishu API .*?(403|permission|forbidden|not.?allowed|access denied|no auth)/i.test(message)) {
    return `${message} Check Feishu app Drive permissions and make sure the app/bot is a collaborator of the target BP folder.`;
  }
  return message;
}

async function tryWakeAfterUpload(env) {
  if (String(env.BP_WAKE_ON_UPLOAD || "").toLowerCase() === "false") {
    return { skipped: true, reason: "BP_WAKE_ON_UPLOAD=false" };
  }
  try {
    const response = await wakeRequest(env);
    const payload = await response.json().catch(() => ({}));
    return { ok: true, ...payload };
  } catch (error) {
    return {
      ok: false,
      warning: `Ingest job was queued, but wake request could not be recorded. ${userFacingError(error)}`,
    };
  }
}

function authorizeWakeAgent(request, env) {
  const expectedToken = env.WAKE_TOKEN;
  if (!expectedToken) {
    return json({ error: "WAKE_TOKEN is not configured." }, 500);
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
  const lang = localizedLang(url.searchParams.get("lang"));
  const query = url.searchParams.get("q");
  const industry = url.searchParams.get("industry");
  const stage = url.searchParams.get("stage");
  const recommendation = url.searchParams.get("recommendation");
  const country = url.searchParams.get("country");
  const customerType = url.searchParams.get("customerType");
  const revenueStage = url.searchParams.get("revenueStage");
  const riskLevel = url.searchParams.get("riskLevel");
  const tag = url.searchParams.get("tag");
  const aiRelated = url.searchParams.get("aiRelated");
  const sortBy = url.searchParams.get("sortBy") || "updated_desc";
  const scoringTemplate = normalizeScoringTemplate(url.searchParams.get("scoringTemplate"));
  const weightProfileId = Number(url.searchParams.get("weightProfileId") || 0);
  const aiOnly = url.searchParams.get("aiOnly") === "true";
  const actor = request.headers.get("x-bp-user") || "";
  const highlightOnly = url.searchParams.get("highlightOnly") === "true";
  const hiddenOnly = url.searchParams.get("hiddenOnly") === "true";
  const includePersonalScoring = url.searchParams.get("includePersonalScoring") === "true";
  const conditions = [];
  const bindings = [];
  await ensureReviewOpsTables(env);

  const keywordTerms = keywordSearchTerms(query);
  if (keywordTerms.length) {
    const keywordFields = [
      "p.project_name",
      "p.company_name",
      "p.industry",
      "p.country_or_region",
      "p.financing_stage",
      "p.customer_type",
      "p.revenue_stage",
      "p.business_model",
      "p.one_line_summary",
      "p.ai_category",
      "p.tags",
      "p.team_highlights",
      "p.traction",
      "p.risks",
      "t.profile_json",
    ];
    conditions.push(
      keywordTerms
        .map(() => `(${keywordFields.map((field) => `${field} LIKE ?`).join(" OR ")})`)
        .join(" AND "),
    );
    keywordTerms.forEach((term) => {
      bindings.push(...Array(keywordFields.length).fill(likeTerm(term)));
    });
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
  if (country) {
    conditions.push("p.country_or_region LIKE ?");
    bindings.push(likeTerm(country));
  }
  if (customerType) {
    conditions.push("p.customer_type LIKE ?");
    bindings.push(likeTerm(customerType));
  }
  if (riskLevel) {
    conditions.push("p.risk_level = ?");
    bindings.push(riskLevel);
  }
  if (tag) {
    conditions.push("(p.tags LIKE ? OR p.ai_category LIKE ? OR t.profile_json LIKE ?)");
    bindings.push(likeTerm(tag), likeTerm(tag), likeTerm(tag));
  }
  if (aiRelated === "true") {
    conditions.push("p.ai_related = 1");
  } else if (aiRelated === "false") {
    conditions.push("p.ai_related = 0");
  }
  if (aiOnly) {
    conditions.push("p.ai_related = 1");
  }
  if (highlightOnly) {
    conditions.push("EXISTS (SELECT 1 FROM bp_marks hm WHERE hm.document_id = p.document_id AND hm.actor = ? AND hm.mark = 'highlight')");
    bindings.push(actor);
  }
  if (hiddenOnly) {
    conditions.push(`(
      EXISTS (SELECT 1 FROM bp_project_status hs WHERE hs.document_id = p.document_id AND hs.status IN ('discussed', 'meeting_selected')) OR
      EXISTS (SELECT 1 FROM bp_marks nm WHERE nm.document_id = p.document_id AND nm.actor = ? AND nm.mark = 'not_interested') OR
      EXISTS (SELECT 1 FROM bp_activity ha WHERE ha.document_id = p.document_id AND ha.actor = ? AND (ha.status = 'not_interested' OR ha.not_interested_at IS NOT NULL))
    )`);
    bindings.push(actor, actor);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const usesPersonalScoringSort = sortBy === "personal_scoring_desc";
  const orderBy = projectOrderBy(usesPersonalScoringSort ? "updated_desc" : sortBy);
  const resultLimit = revenueStage ? 2000 : 200;
  const result = await env.DB.prepare(`
    WITH library_order AS (
      SELECT
        p2.document_id,
        ROW_NUMBER() OVER (
          ORDER BY COALESCE(d2.created_at, p2.created_at, ''), p2.document_id
        ) AS library_number
      FROM projects p2
      JOIN documents d2 ON d2.id = p2.document_id
    )
    SELECT
      p.id,
      p.document_id,
      COALESCE(json_extract(t.profile_json, '$.project_name'), p.project_name) AS project_name,
      COALESCE(json_extract(t.profile_json, '$.company_name'), p.company_name) AS company_name,
      COALESCE(json_extract(t.profile_json, '$.industry'), p.industry) AS industry,
      COALESCE(json_extract(t.profile_json, '$.country_or_region'), p.country_or_region) AS country_or_region,
      COALESCE(json_extract(t.profile_json, '$.financing_stage'), p.financing_stage) AS financing_stage,
      COALESCE(json_extract(t.profile_json, '$.customer_type'), p.customer_type) AS customer_type,
      COALESCE(json_extract(t.profile_json, '$.revenue_stage'), p.revenue_stage) AS revenue_stage,
      COALESCE(json_extract(t.profile_json, '$.recommendation'), p.recommendation) AS recommendation,
      COALESCE(json_extract(t.profile_json, '$.risk_level'), p.risk_level) AS risk_level,
      p.ai_related,
      COALESCE(json_extract(t.profile_json, '$.ai_category'), p.ai_category) AS ai_category,
      COALESCE(json_extract(t.profile_json, '$.business_model'), p.business_model) AS business_model,
      COALESCE(json_extract(t.profile_json, '$.one_line_summary'), p.one_line_summary) AS one_line_summary,
      COALESCE(json_extract(t.profile_json, '$.team_highlights'), p.team_highlights) AS team_highlights,
      COALESCE(json_extract(t.profile_json, '$.traction'), p.traction) AS traction,
      COALESCE(json_extract(t.profile_json, '$.risks'), p.risks) AS risks,
      COALESCE(json_extract(t.profile_json, '$.tags'), p.tags) AS tags,
      p.screening_score,
      p.team_score,
      p.traction_score,
      p.created_at,
      p.updated_at,
      d.file_name,
      d.source_url,
      d.created_at AS document_created_at,
      t.profile_json AS localized_profile_json,
      lo.library_number
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN library_order lo ON lo.document_id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    ${where}
    ORDER BY ${orderBy}
    LIMIT ${resultLimit}
  `).bind(lang, ...bindings).all();

  let profile = null;
  if (Number.isFinite(weightProfileId) && weightProfileId > 0) {
    await ensureWeightTables(env);
    profile = await getWeightProfile(weightProfileId, env);
  }
  let projects = (result.results || []).map((row) => normalizeProject(row, lang));
  if (revenueStage) {
    projects = projects.filter((project) => matchesProjectRevenueStage(project, revenueStage)).slice(0, 200);
  }
  if (profile) {
    projects = rankProjectsByProfile(projects, profile).slice(0, 200);
  }
  if (includePersonalScoring || usesPersonalScoringSort) {
    await attachPersonalScoring(projects, actor, env, scoringTemplate);
  }
  if (usesPersonalScoringSort) {
    projects = sortProjectsByPersonalScoring(projects).slice(0, 200);
  }
  await attachProjectListCollaboration(projects, env, lang, actor);

  return json(
    {
      projects: projects.map((project) => listProjectDto(project, lang)),
      weight_profile: profile ? normalizeWeightProfile(profile) : null,
      highlight_summary: summarizeProjectHighlights(projects),
    },
    200,
    { "cache-control": "private, max-age=30, stale-while-revalidate=120" },
  );
}

async function listFilterOptions(request, env) {
  const lang = localizedLang(new URL(request.url).searchParams.get("lang"));
  const result = await env.DB.prepare(`
    SELECT p.industry, p.country_or_region, p.ai_category, p.financing_stage, p.customer_type,
           p.revenue_stage, p.recommendation, p.risk_level, p.tags, t.profile_json AS localized_profile_json
    FROM projects p
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 2000
  `).bind(lang).all();

  const buckets = {
    industries: new Map(),
    stages: new Map(),
    countries: new Map(),
    customer_types: new Map(),
    revenue_stages: new Map(),
    recommendations: new Map(),
    risk_levels: new Map(),
    tags: new Map(),
  };

  for (const row of result.results || []) {
    const localized = parseObjectField(row.localized_profile_json);
    addOptionParts(buckets.industries, row.industry, localized.industry);
    addOptionParts(buckets.stages, row.financing_stage, localized.financing_stage);
    addOptionParts(buckets.countries, row.country_or_region, localized.country_or_region);
    addOptionParts(buckets.customer_types, row.customer_type, localized.customer_type);
    addRevenueStageOptionParts(buckets.revenue_stages, row.revenue_stage, localized.revenue_stage);
    addLevelOption(buckets.recommendations, row.recommendation);
    addLevelOption(buckets.risk_levels, row.risk_level);
    addOptionParts(buckets.tags, parseJsonField(row.tags), parseJsonField(localized.tags));
    addOptionParts(buckets.tags, parseJsonField(row.ai_category), parseJsonField(localized.ai_category));
  }

  return json({
    options: {
      industries: sortedOptions(buckets.industries),
      stages: sortedOptions(buckets.stages),
      countries: sortedOptions(buckets.countries),
      customer_types: sortedOptions(buckets.customer_types),
      revenue_stages: revenueStageOptions(buckets.revenue_stages, lang),
      recommendations: levelOptions(buckets.recommendations),
      risk_levels: levelOptions(buckets.risk_levels),
      tags: sortedOptions(buckets.tags).slice(0, 160),
    },
  });
}

function addOptionParts(bucket, value, labelValue = value) {
  const values = splitFilterValue(value);
  const labels = splitFilterValue(labelValue);
  for (let index = 0; index < values.length; index += 1) {
    const item = String(values[index] || "").trim();
    if (!isUsefulFilterValue(item)) continue;
    const label = String(labels[index] || labels[0] || item).trim();
    const key = item.toLowerCase();
    bucket.set(key, bucket.get(key) || { value: item, label: label || item });
  }
}

function addLevelOption(bucket, value) {
  const normalized = normalizeLevelValue(value);
  if (normalized) bucket.set(normalized, normalized);
}

function sortedOptions(bucket) {
  return [...bucket.values()]
    .sort((left, right) => left.label.localeCompare(right.label, "zh-Hans-u-co-pinyin"))
    .map((option) => ({ value: option.value, label: option.label }));
}

function levelOptions(bucket) {
  const defaults = ["高", "中", "低", "未知"];
  const values = new Set([...defaults, ...bucket.values()]);
  return [...values].map((value) => ({
    value,
    label: { en: levelLabel(value, "en"), zh: levelLabel(value, "zh") },
  }));
}

function normalizeLevelValue(value) {
  const text = String(value || "").trim().toLowerCase();
  if (!text) return "";
  if (["高", "high", "strong"].includes(text)) return "高";
  if (["中", "medium", "mid", "moderate"].includes(text)) return "中";
  if (["低", "low", "weak"].includes(text)) return "低";
  if (["未知", "unknown", "n/a", "na"].includes(text)) return "未知";
  return String(value || "").trim();
}

function levelLabel(value, lang) {
  const labels = {
    高: { en: "High", zh: "高" },
    中: { en: "Medium", zh: "中" },
    低: { en: "Low", zh: "低" },
    未知: { en: "Unknown", zh: "未知" },
  };
  return labels[value]?.[lang] || value;
}

const REVENUE_STAGE_DEFINITIONS = [
  {
    value: "unknown",
    label: { en: "Unknown", zh: "未知" },
    aliases: ["unknown", "未知", "n/a", "na", "none", "null", "not disclosed", "undisclosed", "待定", "不详", "未披露"],
  },
  {
    value: "no_revenue",
    label: { en: "No revenue", zh: "暂无收入" },
    aliases: [
      "no revenue",
      "pre revenue",
      "pre-revenue",
      "prerevenue",
      "no income",
      "no sales",
      "not generating revenue",
      "not monetized",
      "暂无收入",
      "无收入",
      "尚无收入",
      "没有收入",
      "未产生收入",
      "无营收",
      "未商业化",
      "未变现",
      "0收入",
    ],
  },
  {
    value: "pilot_poc",
    label: { en: "Pilot / POC", zh: "试点 / POC" },
    aliases: [
      "pilot",
      "poc",
      "proof of concept",
      "paid pilot",
      "trial",
      "trial customer",
      "pilot customer",
      "试点",
      "试用",
      "概念验证",
      "验证阶段",
      "试点客户",
      "测试客户",
    ],
  },
  {
    value: "early_revenue",
    label: { en: "Early revenue", zh: "早期收入" },
    aliases: [
      "early revenue",
      "initial revenue",
      "first revenue",
      "some revenue",
      "revenue generating",
      "paid customer",
      "paid customers",
      "paying customer",
      "paying customers",
      "commercialized",
      "monetized",
      "已有收入",
      "早期收入",
      "初步收入",
      "少量收入",
      "开始收入",
      "付费客户",
      "商业化初期",
      "已商业化",
      "已变现",
    ],
  },
  {
    value: "scaling_revenue",
    label: { en: "Scaling revenue", zh: "规模化收入" },
    aliases: [
      "scaling revenue",
      "revenue growth",
      "growing revenue",
      "significant revenue",
      "recurring revenue",
      "mrr",
      "arr",
      "scale revenue",
      "规模化收入",
      "规模化营收",
      "收入增长",
      "增长收入",
      "稳定收入",
      "持续收入",
      "经常性收入",
      "放量",
    ],
  },
  {
    value: "profitable",
    label: { en: "Profitable", zh: "已盈利" },
    aliases: [
      "profitable",
      "profit",
      "profitability",
      "break even",
      "break-even",
      "breakeven",
      "positive cash flow",
      "已盈利",
      "盈利",
      "利润",
      "盈亏平衡",
      "现金流为正",
    ],
  },
];

const REVENUE_STAGE_BY_VALUE = new Map(REVENUE_STAGE_DEFINITIONS.map((item) => [item.value, item]));

function addRevenueStageOptionParts(bucket, value, labelValue = value) {
  const parts = [...splitFilterValue(value), ...splitFilterValue(labelValue)];
  for (const part of parts) {
    const canonical = normalizeRevenueStageValue(part);
    if (!canonical) continue;
    const entry = bucket.get(canonical) || { value: canonical, rawValues: new Set() };
    entry.rawValues.add(String(part || "").trim());
    bucket.set(canonical, entry);
  }
}

function revenueStageOptions(bucket, lang) {
  return REVENUE_STAGE_DEFINITIONS
    .filter((definition) => bucket.has(definition.value))
    .map((definition) => ({
      value: definition.value,
      label: definition.label[lang] || definition.label.en,
    }));
}

function matchesProjectRevenueStage(project, selectedValue) {
  const selected = normalizeRevenueStageValue(selectedValue);
  if (!selected) return false;
  return normalizeRevenueStageValue(project?.revenue_stage) === selected;
}

function normalizeRevenueStageValue(value) {
  const text = normalizeRevenueStageText(value);
  if (!text) return "";
  if (REVENUE_STAGE_BY_VALUE.has(text)) return text;
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("unknown").aliases) || text === "-") return "unknown";
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("profitable").aliases)) return "profitable";
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("scaling_revenue").aliases)) return "scaling_revenue";
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("early_revenue").aliases)) return "early_revenue";
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("pilot_poc").aliases)) return "pilot_poc";
  if (matchesAny(text, REVENUE_STAGE_BY_VALUE.get("no_revenue").aliases)) return "no_revenue";
  if (/营收|收入|revenue/.test(text)) return "early_revenue";
  return "";
}

function normalizeRevenueStageText(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[／\\/]+/g, " / ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchesAny(text, aliases = []) {
  return aliases.some((alias) => {
    const normalizedAlias = normalizeRevenueStageText(alias);
    return text === normalizedAlias || text.includes(normalizedAlias);
  });
}

function isUsefulFilterValue(value) {
  const text = String(value || "").trim();
  if (!text) return false;
  return !["未知", "unknown", "n/a", "na", "none", "null", "-"].includes(text.toLowerCase());
}

function splitFilterValue(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/[；;|,，/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function projectOrderBy(sortBy) {
  const clauses = {
    updated_desc: "p.updated_at DESC, p.id DESC",
    ai_rank_desc: `
      (
        COALESCE(p.screening_score, 0) * 4 +
        COALESCE(p.team_score, 0) * 2 +
        COALESCE(p.traction_score, 0) * 2 +
        CASE p.recommendation
          WHEN '高' THEN 24
          WHEN '中' THEN 12
          WHEN '低' THEN 4
          ELSE 0
        END -
        CASE p.risk_level
          WHEN '高' THEN 18
          WHEN '中' THEN 8
          WHEN '低' THEN 0
          ELSE 4
        END +
        CASE p.ai_related
          WHEN 1 THEN 3
          ELSE 0
        END
      ) DESC,
      p.screening_score DESC,
      p.team_score DESC,
      p.traction_score DESC,
      p.updated_at DESC,
      p.id DESC
    `,
    screening_score_desc: "p.screening_score DESC, p.updated_at DESC, p.id DESC",
    team_score_desc: "p.team_score DESC, p.updated_at DESC, p.id DESC",
    traction_score_desc: "p.traction_score DESC, p.updated_at DESC, p.id DESC",
    recommendation_desc: `
      CASE p.recommendation
        WHEN '高' THEN 3
        WHEN '中' THEN 2
        WHEN '低' THEN 1
        ELSE 0
      END DESC,
      p.screening_score DESC,
      p.updated_at DESC,
      p.id DESC
    `,
    risk_low_first: `
      CASE p.risk_level
        WHEN '低' THEN 1
        WHEN '中' THEN 2
        WHEN '高' THEN 3
        ELSE 4
      END ASC,
      p.screening_score DESC,
      p.updated_at DESC,
      p.id DESC
    `,
  };
  return clauses[sortBy] || clauses.updated_desc;
}

async function getProject(request, id, env) {
  const documentId = Number(id);
  const url = new URL(request.url);
  const lang = localizedLang(url.searchParams.get("lang"));
  const scoringTemplate = normalizeScoringTemplate(url.searchParams.get("scoringTemplate"));
  if (!Number.isFinite(documentId)) {
    return json({ error: "Invalid project id" }, 400);
  }

  const project = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE p.document_id = ?
  `).bind(lang, documentId).first();

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

  const actor = request.headers.get("x-bp-user") || "";
  const normalized = normalizeProject(project, lang);
  await attachPersonalScoring([normalized], actor, env, scoringTemplate);
  await attachProjectCollaboration([normalized], env, lang, actor);
  return json({ project: normalized, chunks: chunks.results || [] });
}

async function scoringProfile(request, env) {
  await ensureScoringTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const url = new URL(request.url);
  const templateKey = normalizeScoringTemplate(url.searchParams.get("template") || url.searchParams.get("scoringTemplate"));
  const stats = await scoringStats(actor, env, templateKey);
  const latestProfile = await latestWeightProfileForActor(actor, env);
  return json({
    profile: {
      actor,
      template_key: templateKey,
      template_label: scoringTemplateLabel(templateKey),
      weight_summary: summarizeWeightProfile(latestProfile),
      learned_from_count: Number(stats.confirmed_count || 0),
      drafts_waiting: Number(stats.drafts_waiting || 0),
      adjusted_this_week: Number(stats.adjusted_this_week || 0),
      confirmed: Number(stats.confirmed_count || 0),
      last_updated_at: stats.last_updated_at || latestProfile?.updated_at || "",
    },
  });
}

async function scoringQueue(request, env) {
  await ensureScoringTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const url = new URL(request.url);
  const lang = localizedLang(url.searchParams.get("lang"));
  const templateKey = normalizeScoringTemplate(url.searchParams.get("template") || url.searchParams.get("scoringTemplate"));
  const stats = await scoringStats(actor, env, templateKey);
  const drafts = await env.DB.prepare(`
    SELECT
      d.document_id,
      d.template_key,
      d.draft_score,
      d.reason,
      d.uncertainty,
      d.updated_at,
      p.project_name,
      p.company_name,
      p.industry
    FROM bp_score_drafts d
    JOIN projects p ON p.document_id = d.document_id
    LEFT JOIN bp_user_scores s ON s.document_id = d.document_id AND s.actor = d.actor AND s.template_key = d.template_key
    WHERE d.actor = ? AND d.template_key = ? AND s.document_id IS NULL
    ORDER BY d.updated_at DESC
    LIMIT 20
  `).bind(actor, templateKey).all();
  return json({
    stats,
    drafts: (drafts.results || []).map((row) => ({
      ...row,
      label: row.project_name || row.company_name || (lang === "zh" ? "未知项目" : "Unknown project"),
      draft_score: clampScore(row.draft_score),
    })),
  });
}

async function generateScoreDraft(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  await ensureScoringTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const body = await request.json().catch(() => ({}));
  const documentId = Number(body.document_id || 0);
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Current BP draft generation is available first. Select a BP and try again." }, 400);
  }
  const lang = localizedLang(body.lang || request.headers.get("x-bp-locale"));
  const templateKey = normalizeScoringTemplate(body.template_key);
  const profileId = Number(body.profile_id || 0) || null;
  const project = await loadProjectForScoring(documentId, lang, env);
  if (!project) return json({ error: "Project not found." }, 404);
  const profile = profileId ? await getWeightProfile(profileId, env, actor) : await latestWeightProfileForActor(actor, env);
  const draft = await buildScoreDraft(project, profile, templateKey, lang, env);
  await upsertScoreDraft(env, {
    document_id: documentId,
    actor,
    template_key: templateKey,
    profile_id: profile?.id || profileId || null,
    draft,
  });
  const review = await getPersonalScoreReview(documentId, actor, env, templateKey);
  return json({ draft: review.draft, score_review: review, warning: draft.warning || "" }, 201);
}

async function projectScoreReview(request, documentId, env) {
  if (!Number.isFinite(documentId) || documentId <= 0) return json({ error: "Invalid project id." }, 400);
  await ensureScoringTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  if (request.method === "GET") {
    const templateKey = normalizeScoringTemplate(new URL(request.url).searchParams.get("template"));
    return json({ score_review: await getPersonalScoreReview(documentId, actor, env, templateKey) });
  }
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  const body = await request.json().catch(() => ({}));
  const templateKey = normalizeScoringTemplate(body.template_key);
  const draftScore = clampScore(body.ai_draft_score);
  const finalScore = clampScore(body.user_final_score);
  const adjustmentReason = String(body.adjustment_reason || "").slice(0, 1000);
  const dimensions = Array.isArray(body.dimensions) ? body.dimensions.slice(0, 8) : [];
  const aiReason = String(body.ai_reason || "").slice(0, 2000);
  const profileId = Number(body.profile_id || 0) || null;
  await env.DB.prepare(`
    INSERT INTO bp_user_scores(
      document_id, actor, template_key, profile_id, ai_draft_score, ai_reason,
      user_final_score, user_adjustment, adjustment_reason, dimensions_json, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(document_id, actor, template_key) DO UPDATE SET
      profile_id = excluded.profile_id,
      ai_draft_score = excluded.ai_draft_score,
      ai_reason = excluded.ai_reason,
      user_final_score = excluded.user_final_score,
      user_adjustment = excluded.user_adjustment,
      adjustment_reason = excluded.adjustment_reason,
      dimensions_json = excluded.dimensions_json,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    documentId,
    actor,
    templateKey,
    profileId,
    draftScore,
    aiReason,
    finalScore,
    finalScore - draftScore,
    adjustmentReason,
    JSON.stringify(dimensions),
  ).run();
  return json({ score_review: await getPersonalScoreReview(documentId, actor, env, templateKey) });
}

async function projectContext(request, documentId, env) {
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  await ensureProjectCollaborationTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const lang = localizedLang(new URL(request.url).searchParams.get("lang"));
  if (request.method === "GET") {
    const context = await getProjectCollaboration(documentId, env, lang);
    return json({ context });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const type = normalizeContextType(body.type);
  const content = String(body.content || "").trim();
  const metadata = requestClientMetadata(request, body);
  if (!content) {
    return json({ error: "Comment is required." }, 400);
  }
  await env.DB.prepare(`
    INSERT INTO bp_comments(document_id, actor, type, content, metadata_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(documentId, actor, type, content.slice(0, 2400), JSON.stringify(metadata)).run();
  await upsertProjectActivity(env, documentId, actor, type === "question" ? "asked" : "commented", metadata);
  await upsertDailyActivity(env, actor, documentId, type === "question" ? "asked" : "commented");
  const context = await getProjectCollaboration(documentId, env, lang);
  return json({ context }, 201);
}

async function projectActivity(request, documentId, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  await ensureProjectCollaborationTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const body = await request.json().catch(() => ({}));
  const status = normalizeActivityStatus(body.status);
  const metadata = requestClientMetadata(request, body);
  await upsertProjectActivity(env, documentId, actor, status, metadata);
  await upsertDailyActivity(env, actor, documentId, status);
  return json({ ok: true, context: await getProjectCollaboration(documentId, env, localizedLang(body.lang)) });
}

async function projectMarks(request, documentId, env) {
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  await ensureReviewOpsTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  if (request.method === "GET") {
    return json({ ops: await getProjectOps(documentId, actor, env) });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "").trim();
  const metadata = requestClientMetadata(request, body);
  if (action === "global_status") {
    const status = normalizeProjectStatus(body.status);
    const note = String(body.note || "").trim().slice(0, 800);
    await env.DB.prepare(`
      INSERT INTO bp_project_status(document_id, status, note, set_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(document_id) DO UPDATE SET
        status = excluded.status,
        note = excluded.note,
        set_by = excluded.set_by,
        updated_at = CURRENT_TIMESTAMP
    `).bind(documentId, status, note, actor).run();
    await addMeetingEvent(env, {
      week_start: currentWeekStart(),
      event_date: todayDate(),
      type: "status",
      document_id: documentId,
      title: status,
      summary: note,
      actor,
      metadata,
    });
    if (status === "discussed") {
      await upsertProjectActivity(env, documentId, actor, "commented", metadata);
    }
  } else if (action === "personal_mark") {
    const mark = normalizePersonalMark(body.mark);
    const note = String(body.note || "").trim().slice(0, 800);
    await env.DB.prepare(`
      INSERT INTO bp_marks(document_id, actor, mark, note, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(document_id, actor, mark) DO UPDATE SET
        note = excluded.note,
        updated_at = CURRENT_TIMESTAMP
    `).bind(documentId, actor, mark, note).run();
  } else if (action === "highlight") {
    const highlighted = Boolean(body.highlighted);
    if (highlighted) {
      await env.DB.prepare(`
        INSERT INTO bp_marks(document_id, actor, mark, note, created_at, updated_at)
        VALUES (?, ?, 'highlight', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(document_id, actor, mark) DO UPDATE SET
          updated_at = CURRENT_TIMESTAMP
      `).bind(documentId, actor).run();
    } else {
      await env.DB.prepare(`
        DELETE FROM bp_marks
        WHERE document_id = ?
          AND actor = ?
          AND mark = 'highlight'
      `).bind(documentId, actor).run();
    }
  } else if (action === "vote") {
    const vote = normalizeProjectVote(body.vote);
    await env.DB.prepare(`
      INSERT INTO bp_votes(document_id, actor, vote, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(document_id, actor) DO UPDATE SET
        vote = excluded.vote,
        updated_at = CURRENT_TIMESTAMP
    `).bind(documentId, actor, vote).run();
  } else if (action === "shortlist") {
    await upsertShortlistItem(env, actor, documentId, body.note);
  } else {
    return json({ error: "Unsupported mark action." }, 400);
  }
  await upsertDailyActivity(env, actor, documentId, action);
  return json({ ok: true, ops: await getProjectOps(documentId, actor, env) });
}

async function projectLike(request, documentId, env) {
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  await ensureReviewOpsTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const body = await request.json().catch(() => ({}));
  const reaction = normalizeProjectReaction(body.reaction);
  const existing = await env.DB.prepare(`
    SELECT id
    FROM bp_reactions
    WHERE document_id = ?
      AND actor = ?
      AND reaction = ?
      AND target_type = 'project'
      AND COALESCE(target_id, 0) = 0
    LIMIT 1
  `).bind(documentId, actor, reaction).first();
  const shouldReact = typeof body.liked === "boolean" && reaction === "like" ? body.liked : !existing;
  await env.DB.prepare(`
    DELETE FROM bp_reactions
    WHERE document_id = ?
      AND actor = ?
      AND reaction IN ('like', 'dislike')
      AND target_type = 'project'
      AND COALESCE(target_id, 0) = 0
  `).bind(documentId, actor).run();
  if (shouldReact) {
    await env.DB.prepare(`
      INSERT INTO bp_reactions(document_id, actor, reaction, target_type, target_id, created_at)
      VALUES (?, ?, ?, 'project', 0, CURRENT_TIMESTAMP)
    `).bind(documentId, actor, reaction).run();
    await upsertDailyActivity(env, actor, documentId, reaction === "like" ? "liked" : "disliked");
  } else {
    await upsertDailyActivity(env, actor, documentId, reaction === "like" ? "unliked" : "undisliked");
  }
  return json({ ok: true, reaction, active: shouldReact, liked: reaction === "like" && shouldReact, ops: await getProjectOps(documentId, actor, env) });
}

async function shortlistItems(request, env) {
  await ensureReviewOpsTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const lang = localizedLang(new URL(request.url).searchParams.get("lang"));
  if (request.method === "GET") {
    const result = await env.DB.prepare(`
      SELECT s.*, p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
      FROM bp_shortlist_items s
      JOIN projects p ON p.document_id = s.document_id
      JOIN documents d ON d.id = p.document_id
      LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
      WHERE s.owner = ?
      ORDER BY s.position ASC, s.updated_at DESC
      LIMIT 100
    `).bind(lang, actor).all();
    const items = (result.results || []).map((row) => ({
      owner: row.owner,
      position: Number(row.position || 0),
      note: row.note || "",
      added_at: row.created_at,
      project: normalizeProject(row, lang),
    }));
    return json({ items });
  }
  const body = await request.json().catch(() => ({}));
  if (request.method === "POST") {
    const documentId = Number(body.document_id);
    if (!Number.isFinite(documentId) || documentId <= 0) return json({ error: "Invalid project id." }, 400);
    await upsertShortlistItem(env, actor, documentId, body.note);
    return shortlistItems(new Request("https://local/api/shortlist?lang=" + lang, { headers: request.headers }), env);
  }
  if (request.method === "PUT") {
    const ids = Array.isArray(body.document_ids) ? body.document_ids.map(Number).filter((id) => Number.isFinite(id) && id > 0) : [];
    for (let index = 0; index < ids.length; index += 1) {
      await env.DB.prepare(`
        UPDATE bp_shortlist_items
        SET position = ?, updated_at = CURRENT_TIMESTAMP
        WHERE owner = ? AND document_id = ?
      `).bind(index + 1, actor, ids[index]).run();
    }
    return json({ ok: true });
  }
  if (request.method === "DELETE") {
    const documentId = Number(body.document_id);
    if (!Number.isFinite(documentId) || documentId <= 0) return json({ error: "Invalid project id." }, 400);
    await env.DB.prepare("DELETE FROM bp_shortlist_items WHERE owner = ? AND document_id = ?").bind(actor, documentId).run();
    return json({ ok: true });
  }
  return json({ error: "Method not allowed." }, 405);
}

async function weeklyNominations(request, env) {
  await ensureReviewOpsTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const url = new URL(request.url);
  const lang = localizedLang(url.searchParams.get("lang"));
  const weekStart = normalizeWeekStart(url.searchParams.get("week") || (await request.clone().json().catch(() => ({}))).week_start);
  if (request.method === "GET") {
    return json({ week_start: weekStart, nominations: await listNominations(env, weekStart, actor, lang) });
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const documentId = Number(body.document_id);
  const metadata = requestClientMetadata(request, body);
  if (!Number.isFinite(documentId) || documentId <= 0) return json({ error: "Invalid project id." }, 400);
  const count = await env.DB.prepare(`
    SELECT COUNT(*) AS count FROM weekly_nominations WHERE week_start = ? AND nominator = ?
  `).bind(weekStart, actor).first();
  if (Number(count?.count || 0) >= 3) {
    return json({ error: "Weekly nomination limit reached." }, 409);
  }
  const reason = String(body.reason || "").trim().slice(0, 1000);
  await env.DB.prepare(`
    INSERT OR IGNORE INTO weekly_nominations(week_start, document_id, nominator, reason, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(weekStart, documentId, actor, reason).run();
  await addMeetingEvent(env, {
    week_start: weekStart,
    event_date: todayDate(),
    type: "nomination",
    document_id: documentId,
    title: "weekly nomination",
    summary: reason,
    actor,
    metadata,
  });
  await upsertDailyActivity(env, actor, documentId, "nominated");
  return json({ week_start: weekStart, nominations: await listNominations(env, weekStart, actor, lang) }, 201);
}

async function nominationVote(request, nominationId, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  await ensureReviewOpsTables(env);
  const actor = request.headers.get("x-bp-user") || "";
  const body = await request.json().catch(() => ({}));
  const vote = normalizeNominationVote(body.vote);
  const nomination = await env.DB.prepare("SELECT * FROM weekly_nominations WHERE id = ?").bind(nominationId).first();
  if (!nomination) return json({ error: "Nomination not found." }, 404);
  await env.DB.prepare(`
    INSERT INTO nomination_votes(nomination_id, actor, vote, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(nomination_id, actor) DO UPDATE SET
      vote = excluded.vote,
      updated_at = CURRENT_TIMESTAMP
  `).bind(nominationId, actor, vote).run();
  await upsertDailyActivity(env, actor, nomination.document_id, "nomination_vote");
  return json({ ok: true });
}

async function reviewBoard(request, env) {
  await ensureReviewOpsTables(env);
  const url = new URL(request.url);
  const actor = request.headers.get("x-bp-user") || "";
  const lang = localizedLang(url.searchParams.get("lang"));
  const weekStart = normalizeWeekStart(url.searchParams.get("week"));
  const includeLeaderboards = url.searchParams.get("leaderboards") !== "0";
  const [shortlist, nominations, calendar, activity, leaderboards] = await Promise.all([
    shortlistSnapshot(env, actor, lang),
    listNominations(env, weekStart, actor, lang),
    calendarEvents(env, weekStart, lang),
    dailyActivitySummary(env),
    includeLeaderboards ? bpLeaderboards(env, lang) : Promise.resolve(null),
  ]);
  return json({ week_start: weekStart, shortlist, nominations, calendar, activity, leaderboards });
}

async function similarProjects(request, documentId, env) {
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  await ensureReviewOpsTables(env);
  const url = new URL(request.url);
  const lang = localizedLang(url.searchParams.get("lang"));
  const actor = request.headers.get("x-bp-user") || "";
  const base = await fetchProjectForContext(documentId, env, lang);
  if (!base) return json({ error: "Project not found." }, 404);
  const result = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE p.document_id <> ?
    ORDER BY p.screening_score DESC, p.updated_at DESC
    LIMIT 180
  `).bind(lang, documentId).all();
  const candidates = (result.results || [])
    .map((row) => normalizeProject(row, lang))
    .map((project) => ({ ...project, similarity_score: projectSimilarityScore(base, project), compare: structuredProjectCompare(base, project, lang) }))
    .filter((project) => project.similarity_score > 0)
    .sort((a, b) => {
      if (b.similarity_score !== a.similarity_score) return b.similarity_score - a.similarity_score;
      return Number(b.screening_score || 0) - Number(a.screening_score || 0);
    })
    .slice(0, Number(url.searchParams.get("limit") || 6));
  await attachProjectCollaboration(candidates, env, lang, actor);
  return json({
    base,
    similar: candidates.map((project) => ({
      project,
      similarity_score: project.similarity_score,
      compare: project.compare,
    })),
  });
}

async function compareProjects(request, env) {
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);
  await ensureReviewOpsTables(env);
  const body = await request.json().catch(() => ({}));
  const lang = localizedLang(body.lang);
  const ids = uniqueNumbers(body.document_ids || [body.base_id, body.candidate_id]).slice(0, 6);
  if (ids.length < 2) return json({ error: "Choose at least two projects." }, 400);
  const projects = [];
  for (const id of ids) {
    const project = await fetchProjectForContext(id, env, lang);
    if (project) projects.push(project);
  }
  if (projects.length < 2) return json({ error: "Not enough projects found." }, 404);
  const structured = buildCompareMatrix(projects, lang);
  if (!env.LLM_API_KEY) return json({ ...structured, source: "structured" });
  const narrative = await callCompareModel(projects, structured, env, lang);
  return json({ ...structured, ...narrative, source: narrative.source || "llm" });
}

async function getProjectOps(documentId, actor, env) {
  const map = await projectOpsMap([documentId], actor, env);
  return map.get(Number(documentId)) || defaultProjectOps(documentId, actor);
}

async function projectOpsMap(documentIds, actor, env) {
  const ids = [...new Set((documentIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  const map = new Map(ids.map((id) => [id, defaultProjectOps(id, actor)]));
  if (!ids.length) return map;
  await ensureReviewOpsTables(env);
  for (const chunk of chunkArray(ids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const [statuses, marks, votes, shortlist, nominations, reactions] = await Promise.all([
      env.DB.prepare(`SELECT * FROM bp_project_status WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, actor, mark, note, updated_at FROM bp_marks WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, actor, vote, updated_at FROM bp_votes WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, owner, position, updated_at FROM bp_shortlist_items WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, week_start, nominator, reason, created_at FROM weekly_nominations WHERE document_id IN (${placeholders}) ORDER BY created_at DESC`).bind(...chunk).all(),
      env.DB.prepare(`
        SELECT document_id, actor, reaction, MAX(created_at) AS created_at
        FROM bp_reactions
        WHERE document_id IN (${placeholders})
          AND reaction IN ('like', 'dislike')
          AND target_type = 'project'
          AND COALESCE(target_id, 0) = 0
        GROUP BY document_id, actor, reaction
        ORDER BY created_at DESC
      `).bind(...chunk).all(),
    ]);
    for (const row of statuses.results || []) {
      const item = map.get(Number(row.document_id));
      if (item) item.global_status = normalizeStatusRow(row);
    }
    for (const row of marks.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.personal_marks.push({ actor: row.actor, mark: row.mark, note: row.note || "", updated_at: row.updated_at });
      if (row.actor === actor) item.my_marks.push(row.mark);
      if (row.mark === "highlight") {
        item.highlights.actors.push(row.actor);
        item.highlights.count = item.highlights.actors.length;
        if (row.actor === actor) item.highlights.highlighted_by_me = true;
      }
    }
    for (const row of votes.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.votes[row.vote] = (item.votes[row.vote] || 0) + 1;
      if (row.actor === actor) item.my_vote = row.vote;
    }
    for (const row of shortlist.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.shortlisted_by.push(row.owner);
      if (row.owner === actor) {
        item.in_my_shortlist = true;
        item.my_shortlist_position = Number(row.position || 0);
      }
    }
    for (const row of nominations.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.nominated_by.push({ actor: row.nominator, week_start: row.week_start, reason: row.reason || "", created_at: row.created_at });
    }
    for (const row of reactions.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      const bucket = row.reaction === "dislike" ? item.dislikes : item.likes;
      bucket.actors.push(row.actor);
      bucket.count = bucket.actors.length;
      if (row.actor === actor) {
        if (row.reaction === "dislike") {
          bucket.disliked_by_me = true;
        } else {
          bucket.liked_by_me = true;
        }
      }
    }
  }
  for (const item of map.values()) {
    item.shortlisted_by = sortTeamActors(item.shortlisted_by);
    item.nominated_by = sortTeamActorObjects(item.nominated_by);
    item.highlights.actors = sortTeamActors(item.highlights.actors);
    item.likes.actors = sortTeamActors(item.likes.actors);
    item.dislikes.actors = sortTeamActors(item.dislikes.actors);
  }
  return map;
}

async function projectListOpsMap(documentIds, actor, env) {
  const ids = [...new Set((documentIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  const map = new Map(ids.map((id) => [id, defaultProjectOps(id, actor)]));
  if (!ids.length) return map;
  await ensureReviewOpsTables(env);
  for (const chunk of chunkArray(ids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const [statuses, marks, shortlist, reactions] = await Promise.all([
      env.DB.prepare(`SELECT document_id, status, note, set_by, updated_at FROM bp_project_status WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, actor, mark, note, updated_at FROM bp_marks WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, owner, position, updated_at FROM bp_shortlist_items WHERE document_id IN (${placeholders}) AND owner = ?`).bind(...chunk, actor).all(),
      env.DB.prepare(`
        SELECT document_id, actor, reaction, MAX(created_at) AS created_at
        FROM bp_reactions
        WHERE document_id IN (${placeholders})
          AND reaction IN ('like', 'dislike')
          AND target_type = 'project'
          AND COALESCE(target_id, 0) = 0
        GROUP BY document_id, actor, reaction
        ORDER BY created_at DESC
      `).bind(...chunk).all(),
    ]);
    for (const row of statuses.results || []) {
      const item = map.get(Number(row.document_id));
      if (item) item.global_status = normalizeStatusRow(row);
    }
    for (const row of marks.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.personal_marks.push({ actor: row.actor, mark: row.mark, note: row.note || "", updated_at: row.updated_at });
      if (row.actor === actor) item.my_marks.push(row.mark);
      if (row.mark === "highlight") {
        item.highlights.actors.push(row.actor);
        item.highlights.count = item.highlights.actors.length;
        if (row.actor === actor) item.highlights.highlighted_by_me = true;
      }
    }
    for (const row of shortlist.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      item.in_my_shortlist = true;
      item.my_shortlist_position = Number(row.position || 0);
    }
    for (const row of reactions.results || []) {
      const item = map.get(Number(row.document_id));
      if (!item) continue;
      const bucket = row.reaction === "dislike" ? item.dislikes : item.likes;
      bucket.actors.push(row.actor);
      bucket.count = bucket.actors.length;
      if (row.actor === actor) {
        if (row.reaction === "dislike") {
          bucket.disliked_by_me = true;
        } else {
          bucket.liked_by_me = true;
        }
      }
    }
  }
  for (const item of map.values()) {
    item.highlights.actors = sortTeamActors(item.highlights.actors);
    item.likes.actors = sortTeamActors(item.likes.actors);
    item.dislikes.actors = sortTeamActors(item.dislikes.actors);
  }
  return map;
}

function defaultProjectOps(documentId, actor = "") {
  return {
    document_id: Number(documentId),
    actor,
    global_status: { status: "new", note: "", set_by: "", updated_at: "" },
    personal_marks: [],
    my_marks: [],
    votes: { support: 0, oppose: 0, neutral: 0 },
    my_vote: "",
    shortlisted_by: [],
    in_my_shortlist: false,
    my_shortlist_position: 0,
    nominated_by: [],
    highlights: { count: 0, actors: [], highlighted_by_me: false },
    likes: { count: 0, actors: [], liked_by_me: false },
    dislikes: { count: 0, actors: [], disliked_by_me: false },
  };
}

function summarizeProjectHighlights(projects = []) {
  const actors = new Set();
  let highlighted_projects = 0;
  for (const project of projects || []) {
    const highlightActors = project.ops?.highlights?.actors || [];
    if (highlightActors.length) highlighted_projects += 1;
    for (const actor of highlightActors) actors.add(actor);
  }
  return {
    highlighted_projects,
    actors: [...actors],
  };
}

function normalizeStatusRow(row) {
  return {
    status: row?.status || "new",
    note: row?.note || "",
    set_by: row?.set_by || "",
    updated_at: row?.updated_at || "",
  };
}

async function upsertShortlistItem(env, owner, documentId, note = "") {
  const existing = await env.DB.prepare(`
    SELECT document_id FROM bp_shortlist_items WHERE owner = ? AND document_id = ?
  `).bind(owner, documentId).first();
  if (existing) {
    await env.DB.prepare(`
      UPDATE bp_shortlist_items
      SET note = COALESCE(NULLIF(?, ''), note), updated_at = CURRENT_TIMESTAMP
      WHERE owner = ? AND document_id = ?
    `).bind(String(note || "").trim().slice(0, 800), owner, documentId).run();
    return;
  }
  const position = await env.DB.prepare(`
    SELECT COALESCE(MAX(position), 0) + 1 AS next_position
    FROM bp_shortlist_items
    WHERE owner = ?
  `).bind(owner).first();
  await env.DB.prepare(`
    INSERT INTO bp_shortlist_items(owner, document_id, position, note, created_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(owner, documentId, Number(position?.next_position || 1), String(note || "").trim().slice(0, 800)).run();
}

async function shortlistSnapshot(env, actor, lang = "en") {
  const result = await env.DB.prepare(`
    SELECT s.*, p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM bp_shortlist_items s
    JOIN projects p ON p.document_id = s.document_id
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE s.owner = ?
    ORDER BY s.position ASC, s.updated_at DESC
    LIMIT 20
  `).bind(lang, actor).all();
  return (result.results || []).map((row) => ({ position: Number(row.position || 0), note: row.note || "", project: normalizeProject(row, lang) }));
}

async function listNominations(env, weekStart, actor, lang = "en") {
  const result = await env.DB.prepare(`
    SELECT n.*, p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM weekly_nominations n
    JOIN projects p ON p.document_id = n.document_id
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE n.week_start = ?
    ORDER BY n.created_at DESC
  `).bind(lang, weekStart).all();
  const nominationIds = (result.results || []).map((row) => Number(row.id));
  const votesByNomination = new Map();
  if (nominationIds.length) {
    for (const chunk of chunkArray(nominationIds, 80)) {
      const placeholders = chunk.map(() => "?").join(", ");
      const votes = await env.DB.prepare(`
        SELECT nomination_id, actor, vote FROM nomination_votes WHERE nomination_id IN (${placeholders})
      `).bind(...chunk).all();
      for (const row of votes.results || []) {
        const item = votesByNomination.get(Number(row.nomination_id)) || { support: 0, oppose: 0, neutral: 0, my_vote: "" };
        item[row.vote] = (item[row.vote] || 0) + 1;
        if (row.actor === actor) item.my_vote = row.vote;
        votesByNomination.set(Number(row.nomination_id), item);
      }
    }
  }
  return (result.results || []).map((row) => ({
    id: Number(row.id),
    week_start: row.week_start,
    nominator: row.nominator,
    reason: row.reason || "",
    created_at: row.created_at,
    votes: votesByNomination.get(Number(row.id)) || { support: 0, oppose: 0, neutral: 0, my_vote: "" },
    project: normalizeProject(row, lang),
  }));
}

async function calendarEvents(env, weekStart, lang = "en") {
  const result = await env.DB.prepare(`
    SELECT e.*, p.project_name, p.company_name, p.recommendation
    FROM meeting_events e
    LEFT JOIN projects p ON p.document_id = e.document_id
    WHERE e.week_start <= ?
    ORDER BY e.event_date DESC, e.id DESC
    LIMIT 80
  `).bind(weekStart).all();
  return (result.results || []).map((row) => ({
    id: Number(row.id),
    week_start: row.week_start,
    event_date: row.event_date,
    type: row.type,
    document_id: row.document_id ? Number(row.document_id) : null,
    title: row.title || row.project_name || row.company_name || "",
    summary: row.summary || "",
    result: row.result || "",
    actor: row.actor || "",
    project_name: row.project_name || row.company_name || "",
    recommendation: row.recommendation || "",
    metadata: parseObjectField(row.metadata_json),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

async function dailyActivitySummary(env) {
  const result = await env.DB.prepare(`
    SELECT day, actor, action, SUM(count) AS count
    FROM daily_activity
    GROUP BY day, actor, action
    ORDER BY day DESC, count DESC
    LIMIT 80
  `).all();
  return result.results || [];
}

async function bpLeaderboards(env, lang = "en") {
  const [topLiked, topDisliked, viewerCounts] = await Promise.all([
    reactionLeaderboard(env, "like", lang),
    dislikedLeaderboard(env, lang),
    viewerCountLeaderboard(env),
  ]);
  return {
    top_liked_projects: topLiked,
    top_disliked_projects: topDisliked,
    viewer_counts: viewerCounts,
  };
}

async function reactionLeaderboard(env, reaction, lang = "en") {
  const result = await env.DB.prepare(`
    SELECT
      r.document_id,
      COUNT(DISTINCT r.actor) AS count,
      GROUP_CONCAT(DISTINCT r.actor) AS actors,
      MAX(r.created_at) AS updated_at,
      p.*,
      d.file_name,
      d.source_url,
      t.profile_json AS localized_profile_json
    FROM bp_reactions r
    JOIN projects p ON p.document_id = r.document_id
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE r.reaction = ?
      AND r.target_type = 'project'
      AND COALESCE(r.target_id, 0) = 0
    GROUP BY r.document_id
    ORDER BY count DESC, updated_at DESC
    LIMIT 5
  `).bind(lang, reaction).all();
  return (result.results || []).map((row) => leaderboardProjectRow(row, lang));
}

async function dislikedLeaderboard(env, lang = "en") {
  const result = await env.DB.prepare(`
    WITH signals AS (
      SELECT document_id, actor, MAX(created_at) AS updated_at
      FROM bp_reactions
      WHERE reaction = 'dislike'
        AND target_type = 'project'
        AND COALESCE(target_id, 0) = 0
      GROUP BY document_id, actor
      UNION ALL
      SELECT document_id, actor, MAX(updated_at) AS updated_at
      FROM bp_marks
      WHERE mark = 'not_interested'
      GROUP BY document_id, actor
      UNION ALL
      SELECT document_id, actor, MAX(COALESCE(not_interested_at, updated_at)) AS updated_at
      FROM bp_activity
      WHERE status = 'not_interested' OR not_interested_at IS NOT NULL
      GROUP BY document_id, actor
    )
    SELECT
      s.document_id,
      COUNT(DISTINCT s.actor) AS count,
      GROUP_CONCAT(DISTINCT s.actor) AS actors,
      MAX(s.updated_at) AS updated_at,
      p.*,
      d.file_name,
      d.source_url,
      t.profile_json AS localized_profile_json
    FROM signals s
    JOIN projects p ON p.document_id = s.document_id
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    GROUP BY s.document_id
    ORDER BY count DESC, updated_at DESC
    LIMIT 5
  `).bind(lang).all();
  return (result.results || []).map((row) => leaderboardProjectRow(row, lang));
}

async function viewerCountLeaderboard(env) {
  const result = await env.DB.prepare(`
    SELECT actor, COUNT(DISTINCT document_id) AS count, MAX(updated_at) AS updated_at
    FROM bp_activity
    WHERE viewed_at IS NOT NULL OR status = 'viewed'
    GROUP BY actor
  `).all();
  const countByActor = new Map((result.results || []).map((row) => [row.actor, row]));
  return TEAM_USER_META.map((member) => {
    const row = countByActor.get(member.name) || {};
    return {
      actor: member.name,
      count: Number(row.count || 0),
      updated_at: row.updated_at || "",
      member,
    };
  });
}

function leaderboardProjectRow(row, lang = "en") {
  return {
    count: Number(row.count || 0),
    actors: sortTeamActors(String(row.actors || "").split(",")),
    updated_at: row.updated_at || "",
    project: normalizeProject(row, lang),
  };
}

async function addMeetingEvent(env, event) {
  await env.DB.prepare(`
    INSERT INTO meeting_events(week_start, event_date, type, document_id, title, summary, result, actor, metadata_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    event.week_start || currentWeekStart(),
    event.event_date || todayDate(),
    event.type || "note",
    event.document_id || null,
    String(event.title || "").slice(0, 200),
    String(event.summary || "").slice(0, 1200),
    String(event.result || "").slice(0, 200),
    event.actor || "",
    JSON.stringify(event.metadata || {}),
  ).run();
}

async function upsertDailyActivity(env, actor, documentId, action) {
  if (!actor) return;
  await ensureReviewOpsTables(env);
  await env.DB.prepare(`
    INSERT INTO daily_activity(day, actor, document_id, action, count, last_seen_at)
    VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(day, actor, document_id, action) DO UPDATE SET
      count = count + 1,
      last_seen_at = CURRENT_TIMESTAMP
  `).bind(todayDate(), actor, documentId || 0, String(action || "activity").slice(0, 40)).run();
}

function projectSimilarityScore(base, candidate) {
  let score = 0;
  const baseTags = tokenSet([base.industry, base.business_model, base.customer_type, base.revenue_stage, ...(base.tags || []), ...(base.ai_category || [])]);
  const candidateTags = tokenSet([candidate.industry, candidate.business_model, candidate.customer_type, candidate.revenue_stage, ...(candidate.tags || []), ...(candidate.ai_category || [])]);
  const overlap = [...baseTags].filter((token) => candidateTags.has(token)).length;
  score += overlap * 10;
  if (sameKnown(base.industry, candidate.industry)) score += 24;
  if (sameKnown(base.customer_type, candidate.customer_type)) score += 14;
  if (sameKnown(base.business_model, candidate.business_model)) score += 12;
  if (sameKnown(base.financing_stage, candidate.financing_stage)) score += 8;
  if (sameKnown(base.country_or_region, candidate.country_or_region)) score += 6;
  score += Math.max(0, 12 - Math.abs(Number(base.screening_score || 0) - Number(candidate.screening_score || 0)) / 5);
  score += Math.max(0, 8 - Math.abs(Number(base.team_score || 0) - Number(candidate.team_score || 0)) / 8);
  return Math.round(score);
}

function structuredProjectCompare(base, candidate, lang = "en") {
  const scoreDelta = Number(candidate.screening_score || 0) - Number(base.screening_score || 0);
  const teamDelta = Number(candidate.team_score || 0) - Number(base.team_score || 0);
  const tractionDelta = Number(candidate.traction_score || 0) - Number(base.traction_score || 0);
  const candidateBetter = [
    scoreDelta > 0 ? `${lang === "zh" ? "综合分高" : "higher screening score"} +${scoreDelta}` : "",
    teamDelta > 0 ? `${lang === "zh" ? "团队分高" : "stronger team score"} +${teamDelta}` : "",
    tractionDelta > 0 ? `${lang === "zh" ? "进展分高" : "stronger traction score"} +${tractionDelta}` : "",
    riskRank(candidate.risk_level) < riskRank(base.risk_level) ? (lang === "zh" ? "风险更低" : "lower risk") : "",
  ].filter(Boolean);
  const baseBetter = [
    scoreDelta < 0 ? `${lang === "zh" ? "综合分高" : "higher screening score"} +${Math.abs(scoreDelta)}` : "",
    teamDelta < 0 ? `${lang === "zh" ? "团队分高" : "stronger team score"} +${Math.abs(teamDelta)}` : "",
    tractionDelta < 0 ? `${lang === "zh" ? "进展分高" : "stronger traction score"} +${Math.abs(tractionDelta)}` : "",
    riskRank(base.risk_level) < riskRank(candidate.risk_level) ? (lang === "zh" ? "风险更低" : "lower risk") : "",
  ].filter(Boolean);
  return {
    shared_signals: [...tokenSet([base.industry, candidate.industry, base.customer_type, candidate.customer_type, ...(base.tags || []), ...(candidate.tags || [])])].slice(0, 8),
    candidate_better: candidateBetter,
    base_better: baseBetter,
    verdict: comparisonVerdict(scoreDelta + teamDelta * 0.4 + tractionDelta * 0.4 + (riskRank(base.risk_level) - riskRank(candidate.risk_level)) * 4, lang),
  };
}

function buildCompareMatrix(projects, lang = "en") {
  const rows = projects.map((project) => ({
    document_id: project.document_id,
    project_name: project.project_name || project.company_name,
    industry: project.industry,
    business_model: project.business_model,
    customer_type: project.customer_type,
    stage: project.financing_stage,
    screening_score: Number(project.screening_score || 0),
    team_score: Number(project.team_score || 0),
    traction_score: Number(project.traction_score || 0),
    risk_level: project.risk_level,
    recommendation: project.recommendation,
    traction: project.traction,
    risks: project.risks,
  }));
  const ranked = [...rows].sort((a, b) => {
    const scoreA = a.screening_score + a.team_score * 0.35 + a.traction_score * 0.35 - riskRank(a.risk_level) * 8;
    const scoreB = b.screening_score + b.team_score * 0.35 + b.traction_score * 0.35 - riskRank(b.risk_level) * 8;
    return scoreB - scoreA;
  });
  return {
    rows,
    winner_document_id: ranked[0]?.document_id || null,
    verdict:
      lang === "zh"
        ? `${ranked[0]?.project_name || "首位项目"} 当前结构化信号更强，主要看综合分、团队/进展和风险折扣。`
        : `${ranked[0]?.project_name || "The top project"} currently has the strongest structured signal based on score, team/traction, and risk discount.`,
  };
}

function llmBaseUrl(env) {
  return String(env.LLM_BASE_URL || "https://llm-center.modelbest.cn/llm/v1").replace(/\/$/, "");
}

function llmModel(env) {
  return env.LLM_MODEL || "deepseek-v4-flash";
}

function llmExtraBody(env) {
  const extra = { enable_thinking: envFlag(env.LLM_ENABLE_THINKING) };
  const providerId = String(env.LLM_PROVIDER_ID || "").trim();
  if (providerId) {
    extra.providerId = providerId;
  }
  return extra;
}

function llmTimeoutMs(env) {
  const seconds = Number(env.LLM_TIMEOUT_SECONDS || 55);
  return Math.max(1000, Math.min(110000, seconds * 1000));
}

function llmErrorMessage(response, bodyText = "") {
  const payload = safeJsonParse(bodyText) || {};
  const upstreamMessage = String(payload?.error?.message || payload?.message || "").slice(0, 180);
  const suffix = upstreamMessage ? `: ${upstreamMessage}` : "";
  return `LLM request failed: ${response.status}${suffix}`;
}

async function fetchLlmCompletion(env, requestBody) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort("LLM timeout"), llmTimeoutMs(env));
  try {
    return await fetch(`${llmBaseUrl(env)}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${env.LLM_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function callChatCompletion(env, { temperature = 0.2, maxTokens = 1000, messages = [] } = {}) {
  const requestBody = {
    model: llmModel(env),
    temperature,
    messages,
    ...llmExtraBody(env),
  };
  if (Number.isFinite(maxTokens) && maxTokens > 0) {
    requestBody.max_tokens = maxTokens;
  }
  try {
    let response = await fetchLlmCompletion(env, requestBody);
    let bodyText = await response.text();
    if (!response.ok && response.status === 400 && /max_tokens/i.test(bodyText)) {
      const retryBody = { ...requestBody };
      delete retryBody.max_tokens;
      response = await fetchLlmCompletion(env, retryBody);
      bodyText = await response.text();
    }
    if (!response.ok) {
      return { ok: false, status: response.status, error: llmErrorMessage(response, bodyText) };
    }
    const payload = safeJsonParse(bodyText) || {};
    return {
      ok: true,
      payload,
      content: extractChatContent(payload),
    };
  } catch (error) {
    return { ok: false, status: 0, error: `LLM request failed: ${String(error?.message || error).slice(0, 180)}` };
  }
}

function extractChatContent(payload) {
  const message = payload?.choices?.[0]?.message;
  const content = message?.content ?? payload?.choices?.[0]?.text ?? "";
  if (Array.isArray(content)) {
    return content.map((item) => typeof item === "string" ? item : item?.text || item?.content || "").join("");
  }
  return String(content || "");
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function parseLlmJson(content) {
  const text = String(content || "").trim();
  if (!text) return null;
  const direct = safeJsonParse(text);
  if (direct !== null) return direct;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    const parsed = safeJsonParse(fenced[1].trim());
    if (parsed !== null) return parsed;
  }
  const extracted = extractFirstJsonValue(text);
  return extracted ? safeJsonParse(extracted) : null;
}

function extractFirstJsonValue(text) {
  const source = String(text || "");
  const start = source.search(/[\[{]/);
  if (start < 0) return "";
  const stack = [];
  let inString = false;
  let escape = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }
    if (char === "}" || char === "]") {
      const expected = char === "}" ? "{" : "[";
      if (stack.pop() !== expected) return "";
      if (!stack.length) return source.slice(start, index + 1);
    }
  }
  return "";
}

async function callCompareModel(projects, structured, env, lang = "en") {
  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.18,
    maxTokens: 1000,
    messages: [
      {
        role: "system",
        content: `Compare similar BP projects like a product comparison guide. Use only provided structured facts. Return JSON only, without markdown fences. Write every user-facing string in ${answerLanguage}.`,
      },
      {
        role: "user",
        content: `Projects:\n${JSON.stringify(projects.map(candidatePromptProject), null, 2)}\n\nStructured matrix:\n${JSON.stringify(structured, null, 2)}\n\nReturn JSON with verdict, tradeoffs (array), best_for (array), risks_to_check (array).`,
      },
    ],
  });
  if (!result.ok) return { source: "structured", warning: result.error };
  const parsed = parseLlmJson(result.content);
  return parsed && typeof parsed === "object"
    ? { ...parsed, source: "llm" }
    : { source: "structured", warning: "Compare model returned invalid JSON." };
}

function normalizeProjectStatus(value) {
  const status = String(value || "").toLowerCase();
  if (["new", "discussed", "eliminated", "watching", "meeting_selected"].includes(status)) return status;
  return "new";
}

function normalizePersonalMark(value) {
  const mark = String(value || "").toLowerCase();
  if (["support", "oppose", "watch", "discussed", "not_interested", "highlight"].includes(mark)) return mark;
  return "watch";
}

function normalizeProjectVote(value) {
  const vote = String(value || "").toLowerCase();
  if (["support", "oppose", "neutral"].includes(vote)) return vote;
  return "neutral";
}

function normalizeProjectReaction(value) {
  const reaction = String(value || "like").toLowerCase();
  return reaction === "dislike" ? "dislike" : "like";
}

function normalizeNominationVote(value) {
  return normalizeProjectVote(value);
}

function normalizeWeekStart(value) {
  const date = value ? new Date(`${String(value).slice(0, 10)}T00:00:00Z`) : new Date();
  if (!Number.isFinite(date.getTime())) return currentWeekStart();
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function currentWeekStart() {
  return normalizeWeekStart(todayDate());
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function uniqueNumbers(values) {
  const seen = new Set();
  const result = [];
  for (const value of values || []) {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0 || seen.has(number)) continue;
    seen.add(number);
    result.push(number);
  }
  return result;
}

function tokenSet(values) {
  const tokens = new Set();
  for (const value of values || []) {
    String(value || "")
      .toLowerCase()
      .split(/[\s,，/|;；]+/)
      .map((item) => item.trim())
      .filter((item) => item && !["未知", "unknown", "n/a", "na"].includes(item))
      .forEach((item) => tokens.add(item));
  }
  return tokens;
}

function sameKnown(a, b) {
  const left = String(a || "").trim().toLowerCase();
  const right = String(b || "").trim().toLowerCase();
  return left && right && left === right && !["未知", "unknown", "n/a", "na"].includes(left);
}

function riskRank(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("低") || text.includes("low")) return 1;
  if (text.includes("中") || text.includes("medium")) return 2;
  if (text.includes("高") || text.includes("high")) return 3;
  return 2;
}

function comparisonVerdict(score, lang = "en") {
  if (score > 10) return lang === "zh" ? "候选项目整体更优" : "candidate is stronger overall";
  if (score < -10) return lang === "zh" ? "当前项目整体更优" : "base project is stronger overall";
  return lang === "zh" ? "两者接近，建议看风险和进展证据" : "close comparison; check risk and traction evidence";
}

async function projectAssistant(request, documentId, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  if (!Number.isFinite(documentId) || documentId <= 0) {
    return json({ error: "Invalid project id." }, 400);
  }
  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "").trim();
  const lang = localizedLang(body.lang);
  const actor = request.headers.get("x-bp-user") || "";
  const metadata = { source: "project_assistant", ...requestClientMetadata(request, body) };
  if (!question) {
    return json({ error: "Question is required." }, 400);
  }
  await ensureProjectCollaborationTables(env);
  await env.DB.prepare(`
    INSERT INTO bp_comments(document_id, actor, type, content, metadata_json, created_at, updated_at)
    VALUES (?, ?, 'question', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(documentId, actor, question.slice(0, 2400), JSON.stringify(metadata)).run();
  await upsertProjectActivity(env, documentId, actor, "asked", metadata);
  await upsertDailyActivity(env, actor, documentId, "asked");

  const project = await fetchProjectForContext(documentId, env, lang);
  if (!project) {
    return json({ error: "Project not found." }, 404);
  }
  const context = await getProjectCollaboration(documentId, env, lang);
  const chunks = await fetchProjectChunks(documentId, env, 8, question);
  if (!env.LLM_API_KEY) {
    return json(fallbackProjectAssistantAnswer(question, project, context, lang));
  }

  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.22,
    maxTokens: 1300,
    messages: [
      {
        role: "system",
        content:
          `You are a BP detail assistant for a review team. Use the project facts, source snippets, and team comments. Point out teammate comments, disagreements, and missing viewpoints when relevant. Return JSON only, without markdown fences. Write every user-facing string in ${answerLanguage}.`,
      },
      {
        role: "user",
        content: `Current reviewer: ${actor}
Question: ${question}

Project:
${JSON.stringify(candidatePromptProject(project), null, 2)}

Team context:
${JSON.stringify(context, null, 2)}

Source snippets:
${JSON.stringify(chunks, null, 2)}

Return JSON with:
answer: direct answer to the reviewer;
team_summary: concise summary of each teammate's distinct view;
partner_cues: array of short cues such as "Quan already raised X" or "Gary and Frank disagree on Y".`,
      },
    ],
  });
  if (!result.ok) {
    return json({ ...fallbackProjectAssistantAnswer(question, project, context, lang), source: "fallback", warning: result.error });
  }
  const parsed = parseLlmJson(result.content);
  return json(parsed && typeof parsed === "object"
    ? parsed
    : { answer: result.content, team_summary: context.team_summary, partner_cues: [], source: "fallback", warning: "Project assistant returned invalid JSON." });
}

async function attachProjectCollaboration(projects, env, lang = "en", actor = "") {
  if (!projects.length) return;
  const map = await collaborationContextMap(projects.map((project) => project.document_id), env, lang);
  const opsMap = await projectOpsMap(projects.map((project) => project.document_id), actor, env);
  for (const project of projects) {
    project.collaboration = map.get(Number(project.document_id)) || defaultCollaborationContext(lang);
    project.ops = opsMap.get(Number(project.document_id)) || defaultProjectOps(Number(project.document_id), actor);
  }
}

async function attachProjectListCollaboration(projects, env, lang = "en", actor = "") {
  if (!projects.length) return;
  const opsMap = await projectListOpsMap(projects.map((project) => project.document_id), actor, env);
  for (const project of projects) {
    project.collaboration = { document_id: Number(project.document_id), statuses: [], comments: [], team_summary: "" };
    project.ops = opsMap.get(Number(project.document_id)) || defaultProjectOps(Number(project.document_id), actor);
  }
}

async function collaborationStatusMap(documentIds, env, lang = "en") {
  const ids = [...new Set((documentIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  const map = new Map();
  if (!ids.length) return map;
  await ensureProjectCollaborationTables(env);
  const activityRows = [];
  for (const chunk of chunkArray(ids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const activity = await env.DB.prepare(`
      SELECT document_id, actor, status, viewed_at, commented_at, asked_at, not_interested_at, updated_at
      FROM bp_activity
      WHERE document_id IN (${placeholders})
    `).bind(...chunk).all();
    activityRows.push(...(activity.results || []));
  }
  for (const id of ids) {
    const rows = activityRows.filter((row) => Number(row.document_id) === id);
    map.set(id, buildCollaborationContext(id, rows, [], lang));
  }
  return map;
}

async function collaborationContextMap(documentIds, env, lang = "en") {
  const ids = [...new Set((documentIds || []).map(Number).filter((id) => Number.isFinite(id) && id > 0))];
  const map = new Map();
  if (!ids.length) return map;
  await ensureProjectCollaborationTables(env);
  const activityRows = [];
  const commentRows = [];
  for (const chunk of chunkArray(ids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const activity = await env.DB.prepare(`
      SELECT document_id, actor, status, viewed_at, commented_at, asked_at, not_interested_at, updated_at
      FROM bp_activity
      WHERE document_id IN (${placeholders})
    `).bind(...chunk).all();
    const comments = await env.DB.prepare(`
      SELECT id, document_id, actor, type, content, metadata_json, created_at, updated_at
      FROM bp_comments
      WHERE document_id IN (${placeholders})
      ORDER BY id DESC
    `).bind(...chunk).all();
    activityRows.push(...(activity.results || []));
    commentRows.push(...(comments.results || []));
  }
  for (const id of ids) {
    const rows = activityRows.filter((row) => Number(row.document_id) === id);
    const comments = commentRows.filter((row) => Number(row.document_id) === id).slice(0, 12);
    map.set(id, buildCollaborationContext(id, rows, comments, lang));
  }
  return map;
}

function chunkArray(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

async function getProjectCollaboration(documentId, env, lang = "en") {
  const map = await collaborationContextMap([documentId], env, lang);
  return map.get(Number(documentId)) || defaultCollaborationContext(lang);
}

function buildCollaborationContext(documentId, activityRows, commentRows, lang = "en") {
  const byActor = new Map((activityRows || []).map((row) => [row.actor, row]));
  const statuses = TEAM_MEMBERS.map((actor) => {
    const row = byActor.get(actor) || {};
    const meta = teamUserMeta(actor) || {};
    return {
      actor,
      initials: meta.initials || teamUserInitials(actor),
      display_name: meta.displayName || actor,
      class_name: meta.className || "",
      colors: meta.colors || null,
      status: deriveActivityStatus(row),
      viewed_at: row.viewed_at || null,
      commented_at: row.commented_at || null,
      asked_at: row.asked_at || null,
      not_interested_at: row.not_interested_at || null,
      updated_at: row.updated_at || null,
    };
  });
  const comments = (commentRows || []).map((row) => ({
    id: Number(row.id),
    document_id: Number(row.document_id || documentId),
    actor: row.actor,
    type: row.type || "comment",
    content: row.content || "",
    metadata: parseObjectField(row.metadata_json),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
  return {
    document_id: Number(documentId),
    statuses,
    comments,
    team_summary: summarizeTeamViews(statuses, comments, lang),
  };
}

function defaultCollaborationContext(lang = "en") {
  return buildCollaborationContext(0, [], [], lang);
}

function summarizeTeamViews(statuses, comments, lang = "en") {
  if (!comments.length) {
    const visited = statuses.filter((item) => item.status !== "not_visited").length;
    return lang === "zh"
      ? `目前 ${visited}/${TEAM_MEMBERS.length} 位成员有访问或参与记录，暂未留下评论。`
      : `${visited}/${TEAM_MEMBERS.length} teammates have activity, but no comments have been left yet.`;
  }
  const latestByActor = new Map();
  for (const comment of comments) {
    if (!latestByActor.has(comment.actor)) {
      latestByActor.set(comment.actor, comment);
    }
  }
  const parts = [...latestByActor.values()].map((comment) => {
    const verb = comment.type === "question" ? (lang === "zh" ? "提问" : "asked") : (lang === "zh" ? "评论" : "commented");
    return `${shortActorName(comment.actor)} ${verb}: ${comment.content.slice(0, 96)}`;
  });
  const missing = TEAM_MEMBERS.filter((member) => !latestByActor.has(member));
  const suffix = missing.length
    ? lang === "zh"
      ? `尚未看到 ${missing.map(shortActorName).join(", ")} 的明确评论。`
      : `No explicit comments yet from ${missing.map(shortActorName).join(", ")}.`
    : "";
  return `${parts.join(" | ")}${suffix ? ` ${suffix}` : ""}`;
}

function shortActorName(actor) {
  return teamUserInitials(actor);
}

function deriveActivityStatus(row) {
  if (row.not_interested_at || row.status === "not_interested") return "not_interested";
  if (row.commented_at || row.status === "commented") return "commented";
  if (row.asked_at || row.status === "asked") return "asked";
  if (row.viewed_at || row.status === "viewed") return "viewed";
  return "not_visited";
}

function normalizeContextType(value) {
  return String(value || "").toLowerCase() === "question" ? "question" : "comment";
}

function normalizeActivityStatus(value) {
  const status = String(value || "").toLowerCase();
  if (["viewed", "commented", "asked", "not_interested"].includes(status)) return status;
  return "viewed";
}

async function upsertProjectActivity(env, documentId, actor, rawStatus, metadata = {}) {
  await ensureProjectCollaborationTables(env);
  const status = normalizeActivityStatus(rawStatus);
  const metadataJson = JSON.stringify(parseObjectField(metadata));
  const columnByStatus = {
    viewed: "viewed_at",
    commented: "commented_at",
    asked: "asked_at",
    not_interested: "not_interested_at",
  };
  const column = columnByStatus[status] || "viewed_at";
  const existing = await env.DB.prepare(`
    SELECT document_id FROM bp_activity WHERE document_id = ? AND actor = ?
  `).bind(documentId, actor).first();
  if (existing) {
    await env.DB.prepare(`
      UPDATE bp_activity
      SET status = ?, ${column} = CURRENT_TIMESTAMP, metadata_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE document_id = ? AND actor = ?
    `).bind(status, metadataJson, documentId, actor).run();
    return;
  }
  await env.DB.prepare(`
    INSERT INTO bp_activity(document_id, actor, status, ${column}, metadata_json, created_at, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(documentId, actor, status, metadataJson).run();
}

async function fetchProjectForContext(documentId, env, lang = "en") {
  const row = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE p.document_id = ?
  `).bind(lang, documentId).first();
  return row ? normalizeProject(row, lang) : null;
}

async function fetchProjectChunks(documentId, env, limit = 8, question = "") {
  const terms = questionSearchTerms(question);
  if (terms.length) {
    const clauses = terms.map(() => "LOWER(content) LIKE ?").join(" OR ");
    const matches = await env.DB.prepare(`
      SELECT page, chunk_index, content
      FROM chunks
      WHERE document_id = ?
        AND (${clauses})
      ORDER BY chunk_index ASC
      LIMIT 80
    `).bind(documentId, ...terms.map((term) => `%${term}%`)).all();
    const ranked = (matches.results || [])
      .map((chunk) => ({ ...chunk, relevance_score: chunkRelevanceScore(chunk, terms) }))
      .filter((chunk) => chunk.relevance_score > 0)
      .sort((a, b) => b.relevance_score - a.relevance_score || Number(a.chunk_index || 0) - Number(b.chunk_index || 0))
      .slice(0, limit);
    if (ranked.length) return ranked;
  }
  const chunks = await env.DB.prepare(`
    SELECT page, chunk_index, content
    FROM chunks
    WHERE document_id = ?
    ORDER BY chunk_index ASC
    LIMIT ?
  `).bind(documentId, limit).all();
  return chunks.results || [];
}

function questionSearchTerms(question = "") {
  const stopwords = new Set([
    "the", "and", "for", "with", "about", "this", "that", "what", "which", "why", "how", "是否", "这个", "项目", "关于", "哪些", "什么", "以及",
  ]);
  return [...new Set(String(question || "")
    .normalize("NFKC")
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu) || [])]
    .map((term) => term.trim())
    .filter((term) => term.length >= 2 && !stopwords.has(term))
    .slice(0, 8);
}

function chunkRelevanceScore(chunk = {}, terms = []) {
  const content = String(chunk.content || "").normalize("NFKC").toLowerCase();
  if (!content) return 0;
  return terms.reduce((score, term) => {
    const first = content.indexOf(term);
    if (first < 0) return score;
    const occurrences = content.split(term).length - 1;
    const earlyBonus = Math.max(0, 3 - Math.floor(first / 600));
    return score + occurrences * 4 + earlyBonus;
  }, 0);
}

function fallbackProjectAssistantAnswer(question, project, context, lang = "en") {
  return {
    answer:
      lang === "zh"
        ? `已记录你的问题。当前未配置 LLM_API_KEY，所以先基于结构化信息回答：${project.project_name || project.company_name} 的综合分为 ${project.screening_score || 0}，团队分 ${project.team_score || 0}，进展分 ${project.traction_score || 0}，主要风险为 ${joinForPrompt(project.risks) || project.risk_level || "未知"}。`
        : `Your question has been recorded. LLM_API_KEY is not configured, so here is a structured summary: ${project.project_name || project.company_name} has screening ${project.screening_score || 0}, team ${project.team_score || 0}, traction ${project.traction_score || 0}, and key risks around ${joinForPrompt(project.risks) || project.risk_level || "unknown"}.`,
    team_summary: context.team_summary,
    partner_cues: context.comments.slice(0, 3).map((comment) => `${shortActorName(comment.actor)}: ${comment.content.slice(0, 120)}`),
  };
}

function joinForPrompt(value) {
  return Array.isArray(value) ? value.join(", ") : String(value || "");
}

async function ensureProjectCollaborationTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_comments (
      id INTEGER PRIMARY KEY,
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'comment',
      content TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_activity (
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'viewed',
      viewed_at TEXT,
      commented_at TEXT,
      asked_at TEXT,
      not_interested_at TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(document_id, actor),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await addColumnIfMissing(env, "bp_activity", "metadata_json", "TEXT NOT NULL DEFAULT '{}'");
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_reactions (
      id INTEGER PRIMARY KEY,
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      reaction TEXT NOT NULL,
      target_type TEXT NOT NULL DEFAULT 'project',
      target_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(document_id, actor, reaction, target_type, target_id),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_comments_document_created ON bp_comments(document_id, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_comments_actor ON bp_comments(actor)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_activity_actor_status ON bp_activity(actor, status)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_reactions_document_reaction ON bp_reactions(document_id, reaction, target_type)").run();
}

async function ensureReviewOpsTables(env) {
  await ensureProjectCollaborationTables(env);
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_project_status (
      document_id INTEGER PRIMARY KEY,
      status TEXT NOT NULL DEFAULT 'new',
      note TEXT NOT NULL DEFAULT '',
      set_by TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_marks (
      id INTEGER PRIMARY KEY,
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      mark TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(document_id, actor, mark),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_votes (
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      vote TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(document_id, actor),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_shortlist_items (
      owner TEXT NOT NULL,
      document_id INTEGER NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      note TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(owner, document_id),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weekly_nominations (
      id INTEGER PRIMARY KEY,
      week_start TEXT NOT NULL,
      document_id INTEGER NOT NULL,
      nominator TEXT NOT NULL,
      reason TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(week_start, nominator, document_id),
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS nomination_votes (
      nomination_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      vote TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(nomination_id, actor),
      FOREIGN KEY(nomination_id) REFERENCES weekly_nominations(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS meeting_events (
      id INTEGER PRIMARY KEY,
      week_start TEXT NOT NULL,
      event_date TEXT NOT NULL,
      type TEXT NOT NULL,
      document_id INTEGER,
      title TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      result TEXT NOT NULL DEFAULT '',
      actor TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(document_id) REFERENCES documents(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS daily_activity (
      day TEXT NOT NULL,
      actor TEXT NOT NULL,
      document_id INTEGER NOT NULL DEFAULT 0,
      action TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(day, actor, document_id, action)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_project_status_status ON bp_project_status(status)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_marks_document_actor ON bp_marks(document_id, actor)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_votes_document_vote ON bp_votes(document_id, vote)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_shortlist_owner_position ON bp_shortlist_items(owner, position)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_weekly_nominations_week ON weekly_nominations(week_start, created_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_nomination_votes_vote ON nomination_votes(vote)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_meeting_events_week_date ON meeting_events(week_start, event_date)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_daily_activity_day_actor ON daily_activity(day, actor)").run();
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

async function recommendProjects(request, env) {
  const body = await request.json().catch(() => ({}));
  const question = String(body.question || "").trim();
  const lang = localizedLang(body.lang);
  if (!question) {
    return json({ error: "Question is required." }, 400);
  }

  try {
    const intent = await understandRecommendationQuery(question, env, lang);
    const candidates = await recommendationCandidates(intent, question, env, lang);
    const weakMatch = isWeakRecommendationMatch(candidates);
    if (!candidates.length || weakMatch) {
      const guidance = await recommendationGuidance(question, intent, candidates.map((row) => normalizeProject(row, lang)), env, lang);
      return json({
        question,
        query_intent: intent,
        candidates: candidates.map(candidatePromptProject),
        ...guidance,
        recommendations: [],
      });
    }

    const localizedCandidates = candidates.map((row) => normalizeProject(row, lang));
    const collaborationByDocument = await collaborationContextMap(
      localizedCandidates.map((project) => project.document_id),
      env,
      lang,
    );
    const promptProjects = localizedCandidates.map((project) => ({
      ...candidatePromptProject(project),
      collaboration_context: collaborationByDocument.get(Number(project.document_id)) || null,
    }));

    const ai = await callRecommendationModel(question, intent, promptProjects, env, lang);
    return json({
      question,
      query_intent: intent,
      candidates: promptProjects,
      ...ai,
    });
  } catch (error) {
    const warning = `Recommendation pipeline failed: ${error?.message || "unknown error"}`;
    const intent = fallbackQueryIntent(question, lang, warning);
    return json({
      question,
      query_intent: intent,
      candidates: [],
      ...fallbackRecommendationGuidance(intent, lang, warning),
      recommendations: [],
    });
  }
}

async function understandRecommendationQuery(question, env, lang = "en") {
  if (!env.LLM_API_KEY) {
    return fallbackQueryIntent(question, lang, "LLM_API_KEY is not configured. Expanded the query with local dictionaries.");
  }
  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.1,
    maxTokens: 1200,
    messages: [
      {
        role: "system",
        content:
          `Understand the user's project-search intent for a BP library. Return valid JSON only, without markdown fences. User-facing clarifying_question and suggested_queries must be in ${answerLanguage}. Include bilingual synonyms in expanded_keywords when useful.`,
      },
      {
        role: "user",
        content: `Question: ${question}

Return this JSON shape:
{
  "expanded_keywords": ["keyword or synonym, include English and Chinese equivalents where useful"],
  "industries": [],
  "technologies": [],
  "customer_types": [],
  "regions": [],
  "stages": [],
  "must_have": [],
  "nice_to_have": [],
  "negative_filters": [],
  "clarifying_question": "one short question if the intent is broad or underspecified, otherwise empty",
  "suggested_queries": ["2-4 concrete follow-up searches in ${answerLanguage}"]
}`,
      },
    ],
  });
  if (!result.ok) return fallbackQueryIntent(question, lang, result.error);
  const parsed = parseLlmJson(result.content);
  return parsed && typeof parsed === "object"
    ? sanitizeQueryIntent(parsed, question, lang, "llm")
    : fallbackQueryIntent(question, lang, "Query understanding returned invalid JSON.");
}

function fallbackQueryIntent(question, lang = "en", warning = "") {
  const rawTerms = keywordTerms(question);
  const expanded = expandLocalTerms(rawTerms.length ? rawTerms : [question]);
  const lower = `${question} ${expanded.join(" ")}`.toLowerCase();
  const intent = {
    expanded_keywords: expanded,
    industries: pickByDictionary(lower, LOCAL_QUERY_DICTIONARY.industries),
    technologies: pickByDictionary(lower, LOCAL_QUERY_DICTIONARY.technologies),
    customer_types: pickByDictionary(lower, LOCAL_QUERY_DICTIONARY.customer_types),
    regions: pickByDictionary(lower, LOCAL_QUERY_DICTIONARY.regions),
    stages: pickByDictionary(lower, LOCAL_QUERY_DICTIONARY.stages),
    must_have: [],
    nice_to_have: expanded.slice(0, 8),
    negative_filters: [],
    clarifying_question:
      lang === "zh"
        ? "我先按本地同义词扩展做匹配。你更关注行业、客户类型、地区、融资阶段，还是团队/收入进展？"
        : "I expanded the query with local synonyms. Should I focus more on industry, customer type, geography, stage, or team/traction signals?",
    suggested_queries:
      lang === "zh"
        ? ["智能技术医疗 B2B 已有试点", "企业服务 强团队 早期收入", "美国市场 AI 基础设施 Seed"]
        : ["AI/tech healthcare B2B with pilots", "Enterprise SaaS with strong team and early revenue", "US AI infrastructure Seed projects"],
    source: "fallback",
    warning,
  };
  return sanitizeQueryIntent(intent, question, lang, "fallback");
}

function sanitizeQueryIntent(input, question, lang = "en", source = "llm") {
  const intent = input && typeof input === "object" ? input : {};
  const normalized = {
    expanded_keywords: uniqueStrings([...(intent.expanded_keywords || []), ...keywordTerms(question), ...expandLocalTerms(keywordTerms(question))], 32),
    industries: uniqueStrings(intent.industries || [], 12),
    technologies: uniqueStrings(intent.technologies || [], 12),
    customer_types: uniqueStrings(intent.customer_types || [], 10),
    regions: uniqueStrings(intent.regions || [], 10),
    stages: uniqueStrings(intent.stages || [], 10),
    must_have: uniqueStrings(intent.must_have || [], 10),
    nice_to_have: uniqueStrings(intent.nice_to_have || [], 12),
    negative_filters: uniqueStrings(intent.negative_filters || [], 10),
    clarifying_question: String(intent.clarifying_question || "").trim().slice(0, 260),
    suggested_queries: uniqueStrings(intent.suggested_queries || [], 4),
    source: intent.source || source,
    warning: intent.warning || "",
  };
  if (!normalized.expanded_keywords.length) {
    normalized.expanded_keywords = uniqueStrings([question], 1);
  }
  if (!normalized.suggested_queries.length) {
    normalized.suggested_queries =
      lang === "zh"
        ? ["智能技术医疗 团队强 早期进展", "B2B 企业服务 已有收入", "低风险 高推荐 项目"]
        : ["AI/tech healthcare with strong team and traction", "B2B enterprise software with revenue", "Low-risk highly recommended projects"];
  }
  return normalized;
}

function queryTermsFromIntent(intent, question) {
  return uniqueStrings([
    ...(intent.expanded_keywords || []),
    ...(intent.industries || []),
    ...(intent.technologies || []),
    ...(intent.customer_types || []),
    ...(intent.regions || []),
    ...(intent.stages || []),
    ...(intent.must_have || []),
    ...(intent.nice_to_have || []),
    ...keywordTerms(question),
  ], 28).filter((term) => term.length >= 2);
}

const RECOMMENDATION_SQL_TERM_LIMIT = 18;

function recommendationSqlTerms(intent, question) {
  const addGroup = (values, limit) => uniqueStrings(values || [], limit).filter(isUsefulRecommendationSqlTerm);
  const highValue = [
    ...addGroup(intent.must_have, 8),
    ...addGroup(intent.industries, 8),
    ...addGroup(intent.technologies, 8),
    ...addGroup(intent.customer_types, 6),
    ...addGroup(intent.regions, 6),
    ...addGroup(intent.stages, 6),
  ];
  const questionTerms = addGroup(keywordTerms(question), 8);
  const expanded = addGroup(intent.expanded_keywords, 10);
  const niceToHave = addGroup(intent.nice_to_have, 4);
  return uniqueStrings([
    ...highValue,
    ...questionTerms,
    ...expanded,
    ...niceToHave,
  ], RECOMMENDATION_SQL_TERM_LIMIT);
}

function isUsefulRecommendationSqlTerm(value) {
  const term = String(value || "").trim();
  if (term.length < 2 || term.length > 48) return false;
  const lower = term.toLowerCase();
  const lowValue = new Set([
    "project",
    "projects",
    "startup",
    "startups",
    "company",
    "companies",
    "recommend",
    "recommendation",
    "query",
    "search",
    "which",
    "what",
    "with",
    "and",
    "the",
    "项目",
    "公司",
    "创业",
    "推荐",
    "查询",
    "搜索",
    "哪些",
    "哪个",
    "比较",
    "一下",
  ]);
  return !lowValue.has(lower);
}

async function recommendationCandidates(intent, question, env, lang = "en") {
  const terms = recommendationSqlTerms(intent, question);
  const conditions = [];
  const bindings = [];
  const searchText = `(
    COALESCE(p.project_name, '') || ' ' ||
    COALESCE(p.company_name, '') || ' ' ||
    COALESCE(p.industry, '') || ' ' ||
    COALESCE(p.country_or_region, '') || ' ' ||
    COALESCE(p.financing_stage, '') || ' ' ||
    COALESCE(p.customer_type, '') || ' ' ||
    COALESCE(p.revenue_stage, '') || ' ' ||
    COALESCE(p.ai_category, '') || ' ' ||
    COALESCE(p.business_model, '') || ' ' ||
    COALESCE(p.team_highlights, '') || ' ' ||
    COALESCE(p.traction, '') || ' ' ||
    COALESCE(p.risks, '') || ' ' ||
    COALESCE(p.tags, '') || ' ' ||
    COALESCE(p.one_line_summary, '') || ' ' ||
    COALESCE(t.profile_json, '')
  )`;
  for (const term of terms) {
    conditions.push(`${searchText} LIKE ?`);
    bindings.push(likeTerm(term));
  }
  const where = conditions.length ? `WHERE ${conditions.join(" OR ")}` : "";
  let result;
  try {
    result = await env.DB.prepare(`
      SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
      FROM projects p
      JOIN documents d ON d.id = p.document_id
      LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
      ${where}
      ORDER BY p.screening_score DESC, p.updated_at DESC
      LIMIT 60
    `).bind(lang, ...bindings).all();
  } catch (error) {
    return await topScoredRecommendationFallback(env, lang, terms, intent, error);
  }
  const rows = result.results || [];
  const scoredRows = await applyOperationalRanking(scoreCandidates(rows, terms, intent), env);
  if (scoredRows.length >= 8 || !terms.length) {
    return scoredRows.slice(0, 18);
  }
  const fallback = await topScoredRecommendationFallback(env, lang, terms, intent);
  return mergeByDocumentId(scoredRows, fallback)
    .sort((a, b) => {
      if (b.keyword_match_score !== a.keyword_match_score) return b.keyword_match_score - a.keyword_match_score;
      return Number(b.screening_score || 0) - Number(a.screening_score || 0);
    })
    .slice(0, 18);
}

async function topScoredRecommendationFallback(env, lang, terms, intent = {}, sourceError = null) {
  const fallback = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    ORDER BY p.screening_score DESC, p.updated_at DESC
    LIMIT 50
  `).bind(lang).all();
  const rows = fallback.results || [];
  const scoredRows = await applyOperationalRanking(scoreCandidates(rows, terms, intent), env);
  if (scoredRows.length) return scoredRows.slice(0, 18);
  const negativeFilters = intent.negative_filters || [];
  const baselineRows = rows
    .filter((row) => !hasNegativeMatch(row, negativeFilters))
    .map((row) => ({
      ...row,
      keyword_match_score: Math.max(12, Math.round(Number(row.screening_score || 0) / 3)),
      recommendation_fallback_reason: sourceError ? String(sourceError?.message || sourceError).slice(0, 180) : "insufficient_keyword_candidates",
    }));
  return (await applyOperationalRanking(baselineRows, env)).slice(0, 18);
}

function isWeakRecommendationMatch(candidates) {
  if (!candidates.length) return true;
  const bestScore = Math.max(...candidates.map((candidate) => Number(candidate.keyword_match_score || 0)));
  return candidates.length < 3 && bestScore < 8;
}

async function applyOperationalRanking(rows, env) {
  if (!rows.length) return rows;
  await ensureReviewOpsTables(env);
  const ids = rows.map((row) => Number(row.document_id)).filter((id) => Number.isFinite(id) && id > 0);
  const penalties = new Map(ids.map((id) => [id, 0]));
  for (const chunk of chunkArray(ids, 80)) {
    const placeholders = chunk.map(() => "?").join(", ");
    const [statuses, votes, likes] = await Promise.all([
      env.DB.prepare(`SELECT document_id, status FROM bp_project_status WHERE document_id IN (${placeholders})`).bind(...chunk).all(),
      env.DB.prepare(`SELECT document_id, vote, COUNT(*) AS count FROM bp_votes WHERE document_id IN (${placeholders}) GROUP BY document_id, vote`).bind(...chunk).all(),
      env.DB.prepare(`
        SELECT document_id, COUNT(DISTINCT actor) AS count
        FROM bp_reactions
        WHERE document_id IN (${placeholders})
          AND reaction = 'like'
          AND target_type = 'project'
          AND COALESCE(target_id, 0) = 0
        GROUP BY document_id
      `).bind(...chunk).all(),
    ]);
    for (const row of statuses.results || []) {
      const id = Number(row.document_id);
      const status = row.status || "new";
      const penalty = status === "eliminated" ? 80 : status === "discussed" ? 24 : status === "meeting_selected" ? 14 : 0;
      penalties.set(id, (penalties.get(id) || 0) + penalty);
    }
    for (const row of votes.results || []) {
      if (row.vote !== "oppose") continue;
      const id = Number(row.document_id);
      penalties.set(id, (penalties.get(id) || 0) + Number(row.count || 0) * 8);
    }
    for (const row of likes.results || []) {
      const id = Number(row.document_id);
      penalties.set(id, (penalties.get(id) || 0) - Math.min(12, Number(row.count || 0) * 3));
    }
  }
  return rows
    .map((row) => {
      const operationalPenalty = penalties.get(Number(row.document_id)) || 0;
      return {
        ...row,
        operational_penalty: operationalPenalty,
        keyword_match_score: Math.max(0, Number(row.keyword_match_score || 0) - operationalPenalty),
      };
    })
    .filter((row) => Number(row.keyword_match_score || 0) > 0)
    .sort((a, b) => {
      if (b.keyword_match_score !== a.keyword_match_score) return b.keyword_match_score - a.keyword_match_score;
      return Number(b.screening_score || 0) - Number(a.screening_score || 0);
    });
}

function candidatePromptProject(project) {
  return {
    document_id: project.document_id,
    project_name: project.project_name,
    company_name: project.company_name,
    industry: project.industry,
    country_or_region: project.country_or_region,
    ai_related: Boolean(project.ai_related),
    ai_category: parseJsonField(project.ai_category),
    financing_stage: project.financing_stage,
    business_model: project.business_model,
    customer_type: project.customer_type,
    revenue_stage: project.revenue_stage,
    recommendation: project.recommendation,
    screening_score: project.screening_score,
    team_score: project.team_score,
    traction_score: project.traction_score,
    risk_level: project.risk_level,
    one_line_summary: project.one_line_summary,
    team_highlights: parseJsonField(project.team_highlights).slice(0, 4),
    traction: parseJsonField(project.traction).slice(0, 4),
    risks: parseJsonField(project.risks).slice(0, 4),
    tags: parseJsonField(project.tags).slice(0, 8),
    keyword_match_score: project.keyword_match_score || 0,
    operational_penalty: project.operational_penalty || 0,
    source_url: project.source_url,
  };
}

async function recommendationGuidance(question, intent, candidates, env, lang = "en") {
  if (!env.LLM_API_KEY) {
    return fallbackRecommendationGuidance(intent, lang);
  }
  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.25,
    maxTokens: 900,
    messages: [
      {
        role: "system",
        content:
          `The BP library has no strong matches for the user's intent. Return JSON only, without markdown fences. Write every user-facing string in ${answerLanguage}. Help the reviewer refine the search or try nearby directions; do not invent project matches.`,
      },
      {
        role: "user",
        content: `Question: ${question}
Intent:
${JSON.stringify(intent, null, 2)}
Weak candidate sample:
${JSON.stringify(candidates.slice(0, 5).map(candidatePromptProject), null, 2)}

Return JSON with:
answer: short explanation that no strong match was found;
clarifying_question: one useful follow-up question;
suggested_queries: array of 3-5 concrete searches;
filters_used: short array of interpreted criteria.`,
      },
    ],
  });
  if (!result.ok) {
    return fallbackRecommendationGuidance(intent, lang, result.error);
  }
  const parsed = parseLlmJson(result.content);
  if (parsed && typeof parsed === "object") {
    return {
      answer: String(parsed.answer || fallbackRecommendationGuidance(intent, lang).answer),
      clarifying_question: String(parsed.clarifying_question || intent.clarifying_question || ""),
      suggested_queries: uniqueStrings(parsed.suggested_queries || intent.suggested_queries || [], 5),
      filters_used: uniqueStrings(parsed.filters_used || queryTermsFromIntent(intent, "").slice(0, 6), 8),
      source: "llm_guidance",
      warning: intent.warning || "",
    };
  }
  return fallbackRecommendationGuidance(intent, lang, "Guidance generation returned invalid JSON.");
}

function fallbackRecommendationGuidance(intent, lang = "en", warning = "") {
  return {
    answer:
      lang === "zh"
        ? "当前项目库里没有找到足够强的匹配。我已先用本地同义词扩展检索，你可以换一个更具体的行业、客户类型、阶段或地区继续查。"
        : "I could not find a strong match in the current library. I expanded the search with local synonyms; try narrowing by industry, customer type, stage, or geography.",
    clarifying_question: intent.clarifying_question || (
      lang === "zh"
        ? "你想优先看行业匹配，还是团队/收入进展更强的项目？"
        : "Should I prioritize industry fit, or projects with stronger team and traction signals?"
    ),
    suggested_queries: uniqueStrings(intent.suggested_queries || [], 5),
    filters_used: queryTermsFromIntent(intent, "").slice(0, 8),
    source: "fallback_guidance",
    warning: warning || intent.warning || "",
  };
}

async function callRecommendationModel(question, intent, projects, env, lang = "en") {
  if (!env.LLM_API_KEY) {
    return fallbackRecommendationResponse(question, intent, projects, lang);
  }
  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.2,
    maxTokens: 1800,
    messages: [
      {
        role: "system",
        content:
          `You are a BP screening assistant for a international review team. Projects were pre-filtered by query understanding, structured BP tags, translations, and profile fields. Recommend projects only from the provided candidate list. Return valid JSON only, without markdown fences. Write every user-facing string in ${answerLanguage}.`,
      },
      {
        role: "user",
        content: `Question: ${question}
Understood intent:
${JSON.stringify(intent, null, 2)}

Return JSON with:
answer: concise ${answerLanguage} answer;
recommendations: array of up to 8 objects with document_id, project_name, reason, risks, next_step;
filters_used: short array of criteria you applied;
clarifying_question: empty string unless more focus would materially improve the result;
suggested_queries: optional array of 2-4 follow-up searches in ${answerLanguage}.

Projects:
${JSON.stringify(projects, null, 2)}`,
      },
    ],
  });
  if (!result.ok) return fallbackRecommendationResponse(question, intent, projects, lang, result.error);
  const parsed = parseLlmJson(result.content);
  return parsed && typeof parsed === "object"
    ? { ...parsed, source: "llm" }
    : { ...fallbackRecommendationResponse(question, intent, projects, lang, "Recommendation model returned invalid JSON."), raw_answer: result.content.slice(0, 1200) };
}

function fallbackRecommendationResponse(question, intent, projects, lang = "en", warning = "") {
  const recommendations = projects.slice(0, 6).map((project) => ({
    document_id: project.document_id,
    project_name: project.project_name,
    reason:
      lang === "zh"
        ? `本地匹配命中了 ${Number(project.keyword_match_score || 0)} 个相关信号，主要来自标签、摘要或结构化字段。`
        : `Local matching found ${Number(project.keyword_match_score || 0)} relevant signals across tags, summaries, or structured fields.`,
    risks: project.risk_level ? `${lang === "zh" ? "风险等级" : "Risk level"}: ${project.risk_level}` : "",
    next_step:
      lang === "zh"
        ? "建议打开 BP 查看原文证据，并进一步限定行业、地区或融资阶段。"
        : "Open the BP for source evidence, then narrow by industry, geography, or financing stage if needed.",
  }));
  return {
    answer:
      lang === "zh"
        ? "LLM 暂不可用，已用本地同义词扩展和结构化字段召回生成候选。"
        : "The LLM is unavailable, so I used local synonym expansion and structured-field recall to generate candidates.",
    recommendations,
    filters_used: queryTermsFromIntent(intent, question).slice(0, 8),
    clarifying_question: intent.clarifying_question || "",
    suggested_queries: intent.suggested_queries || [],
    source: "fallback",
    warning: warning || intent.warning || "LLM_API_KEY is not configured.",
  };
}

async function generateWeightFactors(request, env) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const prompt = String(body.prompt || "").trim();
  const lang = localizedLang(body.lang);
  if (!prompt) {
    return json({ error: "Prompt is required." }, 400);
  }
  if (!env.LLM_API_KEY) {
    const factors = fallbackFactorsFromPrompt(prompt);
    if (body.save) {
      await ensureWeightTables(env);
      const savedFactors = await saveGeneratedFactors(factors, prompt, body.scope, request.headers.get("x-bp-user") || "", env);
      return json({
        factors: savedFactors.map((factor, index) => ({ ...factor, weight: factors[index]?.weight || DEFAULT_FACTOR_WEIGHTS[index] })),
        saved_factors: savedFactors,
        source: "fallback",
        warning: "LLM_API_KEY is not configured. Generated factors from keyword heuristics.",
      });
    }
    return json({
      factors,
      source: "fallback",
      warning: "LLM_API_KEY is not configured. Generated factors from keyword heuristics.",
    });
  }
  const answerLanguage = lang === "zh" ? "Chinese" : "English";
  const result = await callChatCompletion(env, {
    temperature: 0.15,
    maxTokens: 1400,
    messages: [
      {
        role: "system",
        content:
          `Convert a reviewer's natural-language BP screening preference into at most 5 ranking factors. Return JSON only, without markdown fences. User-facing labels and descriptions must be in ${answerLanguage}. Prefer existing factor keys when possible. Set category to one of: overall_fit, financial, founder_team, market_industry, product_technology, business_customer, risk. For custom semantic needs, use rule.type="semantic_keyword" with keywords matched against project text fields. Allowed structured fields: screening_score, team_score, traction_score, risk_level, recommendation, ai_related, financing_stage, revenue_stage, customer_type, country_or_region, industry, tags, one_line_summary, team_highlights, traction, risks, business_model.`,
      },
      {
        role: "user",
        content: `Preference: ${prompt}

Return:
{
  "title": "short profile title",
  "factors": [
    {
      "key": "stable_snake_case_key",
      "category": "overall_fit|financial|founder_team|market_industry|product_technology|business_customer|risk",
      "label": {"en": "...", "zh": "..."},
      "description": {"en": "...", "zh": "..."},
      "rule": {"type": "field_score|enum_score|boolean_score|known_value|keyword_score|semantic_keyword", "field": "...", "keywords": ["..."]},
      "weight": 40
    }
  ]
}
Weights should follow 40,25,18,11,6 by order.`,
      },
    ],
  });
  const parsedResult = result.ok ? parseLlmJson(result.content) : null;
  const parsed = parsedResult && typeof parsedResult === "object" ? parsedResult : {};
  const factors = sanitizeFactors(parsed.factors, prompt);
  const resultPayload = {
    title: String(parsed.title || "").trim() || (lang === "zh" ? "VRT Agent 权重方案" : "VRT Agent weight profile"),
    factors,
    source: result.ok && parsed.factors ? "llm" : "fallback",
  };
  if (!result.ok || !parsed.factors) {
    resultPayload.warning = result.ok ? "Weight factor model returned invalid JSON." : result.error;
  }
  if (body.save) {
    await ensureWeightTables(env);
    resultPayload.saved_factors = await saveGeneratedFactors(factors, prompt, body.scope, request.headers.get("x-bp-user") || "", env);
    resultPayload.factors = resultPayload.saved_factors.map((factor, index) => ({ ...factor, weight: factors[index]?.weight || DEFAULT_FACTOR_WEIGHTS[index] }));
  }
  return json(resultPayload);
}

async function weightFactors(request, env) {
  await ensureWeightTables(env);
  const owner = request.headers.get("x-bp-user") || "";
  if (request.method === "GET") {
    return json(await listWeightFactorPayload(owner, env));
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const factor = sanitizeFactorForStorage(body, owner);
  const result = await env.DB.prepare(`
    INSERT INTO weight_factors(
      key, name, description, category, scope, owner, source_prompt, metadata_json, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    factor.key,
    factor.name,
    factor.description,
    factor.category,
    factor.scope,
    factor.owner,
    factor.source_prompt,
    factor.metadata_json,
  ).run();
  const row = await getWeightFactor(result.meta?.last_row_id, env);
  return json({ factor: normalizeStoredWeightFactor(row) }, 201);
}

async function weightFactorAction(request, pathname, env) {
  await ensureWeightTables(env);
  const owner = request.headers.get("x-bp-user") || "";
  const [, , , , idPart, action] = pathname.split("/");
  const factorId = Number(idPart);
  if (!Number.isFinite(factorId) || factorId <= 0) {
    return json({ error: "Invalid factor id." }, 400);
  }
  const factor = await getWeightFactor(factorId, env);
  if (!factor) return json({ error: "Factor not found." }, 404);

  if (!action && request.method === "PUT") {
    if (factor.owner !== owner) return json({ error: "Only the owner can edit this factor." }, 403);
    const body = await request.json().catch(() => ({}));
    const next = sanitizeFactorForStorage({ ...normalizeStoredWeightFactor(factor), ...body }, owner);
    await env.DB.prepare(`
      UPDATE weight_factors
      SET key = ?, name = ?, description = ?, category = ?, scope = ?, source_prompt = ?, metadata_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(next.key, next.name, next.description, next.category, next.scope, next.source_prompt, next.metadata_json, factorId).run();
    return json({ factor: normalizeStoredWeightFactor(await getWeightFactor(factorId, env)) });
  }

  if (action === "publish" && request.method === "POST") {
    if (factor.owner !== owner) return json({ error: "Only the owner can publish this factor." }, 403);
    await env.DB.prepare(`
      UPDATE weight_factors
      SET scope = 'public', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(factorId).run();
    return json({ factor: normalizeStoredWeightFactor(await getWeightFactor(factorId, env)) });
  }

  if (action === "copy" && request.method === "POST") {
    if (factor.scope !== "public" && factor.owner !== owner) {
      return json({ error: "Only public factors can be copied from other owners." }, 403);
    }
    const source = normalizeStoredWeightFactor(factor);
    const copied = sanitizeFactorForStorage({ ...source, scope: "personal", source_prompt: source.source_prompt || "" }, owner);
    const result = await env.DB.prepare(`
      INSERT INTO weight_factors(
        key, name, description, category, scope, owner, source_prompt, metadata_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, 'personal', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      `${copied.key}_${safeFactorKey(owner).slice(0, 10)}`.slice(0, 64),
      copied.name,
      copied.description,
      copied.category,
      owner,
      copied.source_prompt,
      copied.metadata_json,
    ).run();
    return json({ factor: normalizeStoredWeightFactor(await getWeightFactor(result.meta?.last_row_id, env)) }, 201);
  }

  return json({ error: "Method not allowed." }, 405);
}

async function listWeightFactorPayload(currentUser, env) {
  const publicRows = await env.DB.prepare(`
    SELECT * FROM weight_factors
    WHERE scope = 'public'
    ORDER BY updated_at DESC, id DESC
    LIMIT 200
  `).all();
  const personalRows = await env.DB.prepare(`
    SELECT * FROM weight_factors
    WHERE owner = ?
    ORDER BY updated_at DESC, id DESC
    LIMIT 200
  `).bind(currentUser).all();
  const system = systemWeightFactors();
  const publicFactors = (publicRows.results || []).map(normalizeStoredWeightFactor);
  const personalFactors = (personalRows.results || []).map(normalizeStoredWeightFactor);
  return {
    factors: [...personalFactors, ...publicFactors, ...system],
    factor_pools: {
      personal: personalFactors,
      public: publicFactors,
      system,
    },
    categories: WEIGHT_FACTOR_CATEGORIES,
  };
}

function systemWeightFactors() {
  return DEFAULT_WEIGHT_FACTORS.map((factor) => ({
    ...factor,
    id: null,
    name: factor.label,
    scope: "system",
    owner: "VRT Agent",
    created_at: "",
    updated_at: "",
    source: "system",
  }));
}

async function saveGeneratedFactors(factors, prompt, scope, owner, env) {
  const saved = [];
  for (const factor of sanitizeFactors(factors, prompt)) {
    const storage = sanitizeFactorForStorage({ ...factor, scope, source_prompt: prompt }, owner);
    const result = await env.DB.prepare(`
      INSERT INTO weight_factors(
        key, name, description, category, scope, owner, source_prompt, metadata_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      storage.key,
      storage.name,
      storage.description,
      storage.category,
      storage.scope,
      storage.owner,
      storage.source_prompt,
      storage.metadata_json,
    ).run();
    saved.push(normalizeStoredWeightFactor(await getWeightFactor(result.meta?.last_row_id, env)));
  }
  return saved;
}

async function getWeightFactor(id, env) {
  return await env.DB.prepare("SELECT * FROM weight_factors WHERE id = ?").bind(id).first();
}

function sanitizeFactorForStorage(input, owner) {
  const label = input.label && typeof input.label === "object"
    ? input.label
    : input.name && typeof input.name === "object"
      ? input.name
      : { en: String(input.name || input.key || "Factor"), zh: String(input.name || input.key || "因素") };
  const description = input.description && typeof input.description === "object"
    ? input.description
    : { en: String(input.description || ""), zh: String(input.description || "") };
  const rule = sanitizeRule(input.rule || {});
  return {
    key: safeFactorKey(input.key || label.en || label.zh).slice(0, 64),
    name: JSON.stringify({
      en: String(label.en || label.zh || "Factor").slice(0, 120),
      zh: String(label.zh || label.en || "因素").slice(0, 120),
    }),
    description: JSON.stringify({
      en: String(description.en || description.zh || "").slice(0, 600),
      zh: String(description.zh || description.en || "").slice(0, 600),
    }),
    category: sanitizeFactorCategory(input.category),
    scope: String(input.scope || "").toLowerCase() === "public" ? "public" : "personal",
    owner: String(owner || input.owner || "Unknown").slice(0, 120),
    source_prompt: String(input.source_prompt || input.prompt || "").slice(0, 2000),
    metadata_json: JSON.stringify({
      rule,
      source: input.source || "custom",
      copied_from_factor_id: input.copied_from_factor_id || null,
    }),
  };
}

function normalizeStoredWeightFactor(row) {
  if (!row) return null;
  const metadata = parseJsonField(row.metadata_json) || {};
  const label = localizedObject(row.name, row.key || "Factor");
  const description = localizedObject(row.description, "");
  return {
    id: Number(row.id),
    key: row.key,
    name: label,
    label,
    description,
    category: sanitizeFactorCategory(row.category),
    scope: row.scope === "public" ? "public" : "personal",
    owner: row.owner || "",
    created_at: row.created_at || "",
    updated_at: row.updated_at || "",
    source_prompt: row.source_prompt || "",
    metadata: metadata || {},
    source: metadata.source || "custom",
    rule: sanitizeRule(metadata.rule || {}),
  };
}

function localizedObject(value, fallback = "") {
  if (value && typeof value === "object") return value;
  const parsed = parseJsonField(value);
  if (parsed && typeof parsed === "object") {
    return {
      en: String(parsed.en || parsed.zh || fallback),
      zh: String(parsed.zh || parsed.en || fallback),
    };
  }
  const text = String(value || fallback || "");
  return { en: text, zh: text };
}

async function weightProfiles(request, env) {
  await ensureWeightTables(env);
  const owner = request.headers.get("x-bp-user") || "";
  if (request.method === "GET") {
    return listWeightProfiles(owner, env);
  }
  if (request.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }
  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim() || "Untitled profile";
  const prompt = String(body.prompt || "").trim();
  const sourceProfileId = Number(body.source_profile_id || 0) || null;
  const factors = sanitizeFactors(body.factors, prompt);
  const result = await env.DB.prepare(`
    INSERT INTO weight_profiles(owner, title, factors_json, prompt, source_profile_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(owner, title, JSON.stringify(factors), prompt, sourceProfileId).run();
  await logWeightEvent(env, result.meta?.last_row_id, owner, "created", title);
  const profile = await getWeightProfile(result.meta?.last_row_id, env);
  return json({ profile: normalizeWeightProfile(profile) }, 201);
}

async function weightProfileAction(request, pathname, env) {
  await ensureWeightTables(env);
  const owner = request.headers.get("x-bp-user") || "";
  const [, , , , idPart, action] = pathname.split("/");
  const profileId = Number(idPart);
  if (!Number.isFinite(profileId) || profileId <= 0) {
    return json({ error: "Invalid profile id." }, 400);
  }
  const profile = await getWeightProfile(profileId, env);
  if (!profile) {
    return json({ error: "Profile not found." }, 404);
  }

  if (!action && request.method === "PUT") {
    if (profile.owner !== owner) {
      return json({ error: "Only the owner can edit this profile." }, 403);
    }
    const body = await request.json().catch(() => ({}));
    const title = String(body.title || profile.title || "").trim() || "Untitled profile";
    const prompt = String(body.prompt ?? profile.prompt ?? "").trim();
    const factors = sanitizeFactors(body.factors, prompt);
    await env.DB.prepare(`
      UPDATE weight_profiles
      SET title = ?, factors_json = ?, prompt = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(title, JSON.stringify(factors), prompt, profileId).run();
    await logWeightEvent(env, profileId, owner, "updated", title);
    return json({ profile: normalizeWeightProfile(await getWeightProfile(profileId, env)) });
  }

  if (action === "copy" && request.method === "POST") {
    const copiedTitle = `${profile.title || "Profile"} (${owner})`;
    const result = await env.DB.prepare(`
      INSERT INTO weight_profiles(owner, title, factors_json, prompt, source_profile_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(owner, copiedTitle, profile.factors_json || "[]", profile.prompt || "", profileId).run();
    await logWeightEvent(env, result.meta?.last_row_id, owner, "copied", `from profile ${profileId}`);
    return json({ profile: normalizeWeightProfile(await getWeightProfile(result.meta?.last_row_id, env)) }, 201);
  }

  if (action === "like" && request.method === "POST") {
    const existing = await env.DB.prepare(`
      SELECT profile_id FROM weight_profile_likes WHERE profile_id = ? AND actor = ?
    `).bind(profileId, owner).first();
    if (existing) {
      await env.DB.prepare("DELETE FROM weight_profile_likes WHERE profile_id = ? AND actor = ?").bind(profileId, owner).run();
      await logWeightEvent(env, profileId, owner, "unliked", "");
    } else {
      await env.DB.prepare(`
        INSERT INTO weight_profile_likes(profile_id, actor, created_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `).bind(profileId, owner).run();
      await logWeightEvent(env, profileId, owner, "liked", "");
    }
    return json({ profile: normalizeWeightProfile(await getWeightProfile(profileId, env, owner)) });
  }

  if (action === "comments" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const content = String(body.content || "").trim();
    if (!content) {
      return json({ error: "Comment is required." }, 400);
    }
    await env.DB.prepare(`
      INSERT INTO weight_profile_comments(profile_id, actor, content, created_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(profileId, owner, content.slice(0, 1200)).run();
    await logWeightEvent(env, profileId, owner, "commented", content.slice(0, 160));
    return json({ profile: normalizeWeightProfile(await getWeightProfile(profileId, env, owner)) }, 201);
  }

  return json({ error: "Method not allowed." }, 405);
}

async function listWeightProfiles(currentUser, env) {
  const rows = await env.DB.prepare(`
    SELECT
      p.*,
      (SELECT COUNT(*) FROM weight_profile_likes l WHERE l.profile_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM weight_profile_comments c WHERE c.profile_id = p.id) AS comment_count,
      (SELECT COUNT(*) FROM weight_profile_likes ml WHERE ml.profile_id = p.id AND ml.actor = ?) AS liked_by_me
    FROM weight_profiles p
    ORDER BY p.updated_at DESC, p.id DESC
    LIMIT 100
  `).bind(currentUser).all();
  const profiles = [];
  for (const row of rows.results || []) {
    const comments = await env.DB.prepare(`
      SELECT id, actor, content, created_at, updated_at
      FROM weight_profile_comments
      WHERE profile_id = ?
      ORDER BY id DESC
      LIMIT 6
    `).bind(row.id).all();
    const events = await recentWeightEvents(env, row.id);
    profiles.push(normalizeWeightProfile({ ...row, comments: comments.results || [], events }));
  }
  const factorPayload = await listWeightFactorPayload(currentUser, env);
  return json({ profiles, ...factorPayload });
}

async function getWeightProfile(id, env, currentUser = "") {
  const profile = await env.DB.prepare(`
    SELECT
      p.*,
      (SELECT COUNT(*) FROM weight_profile_likes l WHERE l.profile_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM weight_profile_comments c WHERE c.profile_id = p.id) AS comment_count,
      (SELECT COUNT(*) FROM weight_profile_likes ml WHERE ml.profile_id = p.id AND ml.actor = ?) AS liked_by_me
    FROM weight_profiles p
    WHERE p.id = ?
  `).bind(currentUser, id).first();
  if (!profile) return null;
  const comments = await env.DB.prepare(`
    SELECT id, actor, content, created_at, updated_at
    FROM weight_profile_comments
    WHERE profile_id = ?
    ORDER BY id DESC
    LIMIT 6
  `).bind(id).all();
  const events = await recentWeightEvents(env, id);
  return { ...profile, comments: comments.results || [], events };
}

async function ensureWeightTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weight_factors (
      id INTEGER PRIMARY KEY,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'overall_fit',
      scope TEXT NOT NULL DEFAULT 'personal',
      owner TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      source_prompt TEXT NOT NULL DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}'
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weight_profiles (
      id INTEGER PRIMARY KEY,
      owner TEXT NOT NULL,
      title TEXT NOT NULL,
      factors_json TEXT NOT NULL DEFAULT '[]',
      prompt TEXT NOT NULL DEFAULT '',
      source_profile_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weight_profile_likes (
      profile_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(profile_id, actor),
      FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weight_profile_comments (
      id INTEGER PRIMARY KEY,
      profile_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS weight_profile_events (
      id INTEGER PRIMARY KEY,
      profile_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      detail TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(profile_id) REFERENCES weight_profiles(id)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_weight_factors_scope_updated ON weight_factors(scope, updated_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_weight_factors_owner_updated ON weight_factors(owner, updated_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_weight_factors_key ON weight_factors(key)").run();
}

async function logWeightEvent(env, profileId, actor, action, detail = "") {
  if (!profileId) return;
  await env.DB.prepare(`
    INSERT INTO weight_profile_events(profile_id, actor, action, detail, created_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(profileId, actor, action, String(detail || "").slice(0, 300)).run();
}

async function recentWeightEvents(env, profileId) {
  const result = await env.DB.prepare(`
    SELECT id, actor, action, detail, created_at
    FROM weight_profile_events
    WHERE profile_id = ?
    ORDER BY id DESC
    LIMIT 6
  `).bind(profileId).all();
  return result.results || [];
}

function normalizeWeightProfile(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    owner: row.owner,
    title: row.title,
    factors: sanitizeFactors(parseJsonField(row.factors_json), row.prompt),
    prompt: row.prompt || "",
    source_profile_id: row.source_profile_id || null,
    like_count: Number(row.like_count || 0),
    comment_count: Number(row.comment_count || 0),
    liked_by_me: Number(row.liked_by_me || 0) > 0,
    comments: (row.comments || []).map((comment) => ({
      id: Number(comment.id),
      actor: comment.actor,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
    })),
    events: (row.events || []).map((event) => ({
      id: Number(event.id),
      actor: event.actor,
      action: event.action,
      detail: event.detail,
      created_at: event.created_at,
    })),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function sanitizeFactors(input, prompt = "") {
  const source = Array.isArray(input) ? input : [];
  const fallback = source.length ? source : fallbackFactorsFromPrompt(prompt);
  return fallback.slice(0, 5).map((factor, index) => {
    const known = DEFAULT_WEIGHT_FACTORS.find((item) => item.key === factor.key) || {};
    const label = factor.label && typeof factor.label === "object" ? factor.label : known.label || {};
    const description = factor.description && typeof factor.description === "object" ? factor.description : known.description || {};
    const rule = sanitizeRule(factor.rule || known.rule || { type: "known_value", field: "industry" });
    return {
      id: factor.id || factor.factor_id || null,
      factor_id: factor.factor_id || factor.id || null,
      key: safeFactorKey(factor.key || known.key || `custom_factor_${index + 1}`),
      name: label,
      category: sanitizeFactorCategory(factor.category || known.category || inferFactorCategory({ ...factor, rule }, prompt)),
      label: {
        en: String(label.en || label.zh || known.label?.en || `Factor ${index + 1}`).slice(0, 80),
        zh: String(label.zh || label.en || known.label?.zh || `因素 ${index + 1}`).slice(0, 80),
      },
      description: {
        en: String(description.en || description.zh || known.description?.en || "").slice(0, 240),
        zh: String(description.zh || description.en || known.description?.zh || "").slice(0, 240),
      },
      scope: factor.scope || known.scope || "system",
      owner: factor.owner || known.owner || "",
      created_at: factor.created_at || "",
      updated_at: factor.updated_at || "",
      source_prompt: factor.source_prompt || "",
      rule,
      weight: Number(factor.weight || DEFAULT_FACTOR_WEIGHTS[index] || 1),
    };
  });
}

function sanitizeRule(rule) {
  const allowedTypes = new Set(["field_score", "enum_score", "boolean_score", "known_value", "keyword_score", "semantic_keyword"]);
  const allowedFields = new Set([
    "screening_score",
    "team_score",
    "traction_score",
    "risk_level",
    "recommendation",
    "ai_related",
    "financing_stage",
    "revenue_stage",
    "customer_type",
    "country_or_region",
    "industry",
    "tags",
    "one_line_summary",
    "team_highlights",
    "traction",
    "risks",
    "business_model",
  ]);
  const type = allowedTypes.has(rule.type) ? rule.type : "known_value";
  const field = allowedFields.has(rule.field) ? rule.field : "one_line_summary";
  const keywords = Array.isArray(rule.keywords) ? rule.keywords.map((item) => String(item).trim()).filter(Boolean).slice(0, 12) : [];
  return {
    type,
    field,
    keywords,
    scores: rule.scores && typeof rule.scores === "object" ? rule.scores : undefined,
    trueScore: Number(rule.trueScore || 100),
    falseScore: Number(rule.falseScore || 20),
  };
}

function sanitizeFactorCategory(category) {
  const value = String(category || "").trim();
  return WEIGHT_FACTOR_CATEGORIES[value] ? value : "overall_fit";
}

function inferFactorCategory(factor, prompt = "") {
  const key = String(factor.key || "").toLowerCase();
  const field = String(factor.rule?.field || "").toLowerCase();
  const keywords = Array.isArray(factor.rule?.keywords) ? factor.rule.keywords.join(" ").toLowerCase() : "";
  const text = `${key} ${field} ${keywords} ${prompt}`.toLowerCase();
  if (/risk|风险|合规|监管|regulat/.test(text)) return "risk";
  if (/team|founder|创始|团队/.test(text)) return "founder_team";
  if (/revenue|finance|financial|funding|融资|收入|营收|现金|财务/.test(text)) return "financial";
  if (/market|industry|country|region|geograph|行业|市场|地区|国家/.test(text)) return "market_industry";
  if (/product|technology|tech|ai|agent|aigc|模型|技术|产品/.test(text)) return "product_technology";
  if (/customer|traction|pilot|business_model|client|客户|商业模式|试点|增长/.test(text)) return "business_customer";
  return "overall_fit";
}

function fallbackFactorsFromPrompt(prompt) {
  const text = String(prompt || "").toLowerCase();
  const selected = [];
  const add = (key) => {
    const factor = DEFAULT_WEIGHT_FACTORS.find((item) => item.key === key);
    if (factor && !selected.some((item) => item.key === key)) selected.push(factor);
  };
  if (/ai|人工智能|大模型|agent|aigc/.test(text)) add("ai_related");
  if (/team|founder|创始|团队/.test(text)) add("team_score");
  if (/traction|revenue|customer|pilot|收入|客户|试点|增长/.test(text)) add("traction_score");
  if (/risk|风险|合规|监管/.test(text)) add("risk_level");
  if (/stage|融资|seed|series|轮/.test(text)) add("financing_stage");
  add("screening_score");
  add("recommendation");
  for (const factor of DEFAULT_WEIGHT_FACTORS) {
    if (selected.length >= 5) break;
    add(factor.key);
  }
  return selected.slice(0, 5).map((factor, index) => ({ ...factor, weight: DEFAULT_FACTOR_WEIGHTS[index] }));
}

function rankProjectsByProfile(projects, profile) {
  const factors = sanitizeFactors(parseJsonField(profile.factors_json), profile.prompt);
  return projects
    .map((project) => {
      const breakdown = factors.map((factor, index) => {
        const weight = Number(factor.weight || DEFAULT_FACTOR_WEIGHTS[index] || 1);
        const factorScore = scoreProjectFactor(project, factor);
        return {
          key: factor.key,
          label: factor.label,
          weight,
          score: factorScore,
          contribution: Math.round((factorScore * weight) / 100),
        };
      });
      const totalWeight = breakdown.reduce((sum, item) => sum + item.weight, 0) || 1;
      const rawScore = breakdown.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight;
      return {
        ...project,
        custom_rank_score: Math.round(rawScore),
        custom_rank_breakdown: breakdown,
      };
    })
    .sort((a, b) => {
      if (b.custom_rank_score !== a.custom_rank_score) return b.custom_rank_score - a.custom_rank_score;
      return Number(b.screening_score || 0) - Number(a.screening_score || 0);
    });
}

function scoreProjectFactor(project, factor) {
  const rule = sanitizeRule(factor.rule || {});
  const value = project[rule.field];
  if (rule.type === "field_score") {
    return clampScore(value);
  }
  if (rule.type === "enum_score") {
    return clampScore(rule.scores?.[String(value || "")] ?? 35);
  }
  if (rule.type === "boolean_score") {
    return value ? clampScore(rule.trueScore) : clampScore(rule.falseScore);
  }
  if (rule.type === "keyword_score" || rule.type === "semantic_keyword") {
    return keywordRuleScore(project, rule);
  }
  return knownValueScore(value);
}

function keywordRuleScore(project, rule) {
  const keywords = (rule.keywords || []).map((item) => String(item).toLowerCase()).filter(Boolean);
  if (!keywords.length) return knownValueScore(project[rule.field]);
  const text = projectSearchText(project);
  const matches = keywords.filter((keyword) => text.includes(keyword.toLowerCase())).length;
  if (!matches) return 20;
  return clampScore(35 + matches * 25);
}

function projectSearchText(project) {
  return [
    project.project_name,
    project.company_name,
    project.industry,
    project.country_or_region,
    project.financing_stage,
    project.business_model,
    project.customer_type,
    project.revenue_stage,
    project.one_line_summary,
    ...(project.tags || []),
    ...(project.ai_category || []),
    ...(project.team_highlights || []),
    ...(project.traction || []),
    ...(project.risks || []),
  ].join(" ").toLowerCase();
}

function knownValueScore(value) {
  const text = Array.isArray(value) ? value.join(" ") : String(value || "");
  if (!text.trim() || ["未知", "unknown", "n/a", "na"].includes(text.trim().toLowerCase())) return 20;
  return 70;
}

function clampScore(value) {
  const score = Number(value || 0);
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function safeFactorKey(value) {
  return String(value || "factor")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "factor";
}

function keywordTerms(question) {
  const raw = String(question || "");
  const stopwords = new Set([
    "which",
    "what",
    "where",
    "when",
    "who",
    "how",
    "the",
    "and",
    "with",
    "have",
    "has",
    "项目",
    "哪些",
    "哪个",
    "什么",
    "比较",
    "推荐",
    "一下",
  ]);
  const normalized = raw
    .replace(/[，。！？、；：,.!?;:()（）[\]{}"']/g, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length >= 2 && !stopwords.has(term.toLowerCase()));
  const lexicon = [
    "AI",
    "人工智能",
    "大模型",
    "AIGC",
    "Agent",
    "医疗",
    "教育",
    "金融",
    "消费",
    "企业服务",
    "机器人",
    "芯片",
    "新能源",
    "电商",
    "SaaS",
    "B2B",
    "B2C",
    "美国",
    "欧洲",
    "中国",
    "团队",
    "收入",
    "营收",
    "试点",
    "客户",
    "融资",
  ];
  const extracted = lexicon.filter((term) => raw.toLowerCase().includes(term.toLowerCase()));
  return [...new Set([...normalized, ...extracted])];
}

const LOCAL_QUERY_DICTIONARY = {
  technologies: [
    ["ai", "AI", "人工智能", "大模型", "LLM", "AIGC", "Agent", "智能体", "生成式 AI"],
    ["healthcare", "医疗", "医药", "数字健康", "诊断", "clinical", "clinic", "hospital"],
    ["robotics", "机器人", "自动化", "具身智能"],
    ["chip", "芯片", "半导体", "semiconductor"],
    ["climate", "新能源", "碳", "储能", "climate tech", "energy"],
    ["fintech", "金融科技", "支付", "保险", "风控"],
    ["saas", "SaaS", "软件", "enterprise software", "企业软件"],
  ],
  industries: [
    ["healthcare", "医疗", "医药", "生命科学", "数字健康"],
    ["education", "教育", "EdTech", "培训"],
    ["finance", "金融", "FinTech", "保险"],
    ["consumer", "消费", "零售", "品牌"],
    ["enterprise", "企业服务", "B2B", "SaaS", "enterprise"],
    ["manufacturing", "制造", "工业", "供应链"],
    ["ecommerce", "电商", "跨境", "retail"],
  ],
  customer_types: [
    ["b2b", "B2B", "企业客户", "enterprise", "business customer"],
    ["b2c", "B2C", "消费者", "consumer"],
    ["b2b2c", "B2B2C", "渠道", "platform"],
    ["government", "政府", "政企", "public sector"],
  ],
  regions: [
    ["china", "中国", "国内", "大陆"],
    ["us", "美国", "北美", "United States", "USA"],
    ["europe", "欧洲", "EU", "欧盟"],
    ["southeast asia", "东南亚", "SEA"],
    ["global", "全球", "international", "海外"],
  ],
  stages: [
    ["seed", "种子轮", "天使轮", "Seed", "Angel"],
    ["pre-a", "Pre-A", "Pre A", "A 轮前"],
    ["series a", "A轮", "A 轮", "Series A"],
    ["series b", "B轮", "B 轮", "Series B"],
    ["early", "早期", "early stage"],
    ["growth", "成长期", "growth"],
  ],
};

function expandLocalTerms(terms) {
  const normalized = uniqueStrings(terms || [], 24);
  const lowerTerms = normalized.map((term) => term.toLowerCase());
  const expanded = [...normalized];
  for (const groups of Object.values(LOCAL_QUERY_DICTIONARY)) {
    for (const group of groups) {
      if (group.some((term) => lowerTerms.some((input) => input.includes(term.toLowerCase()) || term.toLowerCase().includes(input)))) {
        expanded.push(...group);
      }
    }
  }
  return uniqueStrings(expanded, 40);
}

function pickByDictionary(text, groups) {
  const lower = String(text || "").toLowerCase();
  const picked = [];
  for (const group of groups) {
    if (group.some((term) => lower.includes(term.toLowerCase()))) {
      picked.push(group[0], ...group.slice(1, 3));
    }
  }
  return uniqueStrings(picked, 12);
}

function uniqueStrings(values, limit = 20) {
  const seen = new Set();
  const result = [];
  for (const value of values || []) {
    const text = String(value || "").trim();
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text.slice(0, 80));
    if (result.length >= limit) break;
  }
  return result;
}

function scoreCandidates(rows, terms, intent = {}) {
  if (!terms.length) {
    return rows;
  }
  return rows
    .map((row) => ({ ...row, keyword_match_score: candidateMatchScore(row, terms, intent) }))
    .filter((row) => row.keyword_match_score > 0 && !hasNegativeMatch(row, intent.negative_filters || []))
    .sort((a, b) => {
      if (b.keyword_match_score !== a.keyword_match_score) {
        return b.keyword_match_score - a.keyword_match_score;
      }
      return Number(b.screening_score || 0) - Number(a.screening_score || 0);
    });
}

function candidateMatchScore(row, terms, intent = {}) {
  const localized = parseObjectField(row.localized_profile_json);
  const keywordText = [
    ...parseJsonField(row.tags),
    ...parseJsonField(row.ai_category),
    ...parseJsonField(localized.tags),
    ...parseJsonField(localized.ai_category),
    row.industry,
    row.country_or_region,
    row.customer_type,
    row.revenue_stage,
    row.business_model,
    localized.industry,
    localized.country_or_region,
    localized.customer_type,
    localized.revenue_stage,
    localized.business_model,
  ]
    .join(" ")
    .toLowerCase();
  const profileText = [
    row.project_name,
    row.company_name,
    row.one_line_summary,
    localized.project_name,
    localized.company_name,
    localized.one_line_summary,
    ...parseJsonField(row.team_highlights),
    ...parseJsonField(row.traction),
    ...parseJsonField(row.risks),
    ...parseJsonField(localized.team_highlights),
    ...parseJsonField(localized.traction),
    ...parseJsonField(localized.risks),
  ]
    .join(" ")
    .toLowerCase();
  const structuredText = keywordText;
  const broadText = `${keywordText} ${profileText}`;
  const weightedGroups = [
    { terms: intent.must_have || [], weight: 8 },
    { terms: intent.industries || [], weight: 7 },
    { terms: intent.technologies || [], weight: 7 },
    { terms: intent.customer_types || [], weight: 6 },
    { terms: intent.regions || [], weight: 6 },
    { terms: intent.stages || [], weight: 6 },
    { terms: intent.expanded_keywords || [], weight: 5 },
    { terms: intent.nice_to_have || [], weight: 3 },
  ];

  let score = terms.reduce((currentScore, term) => {
    const value = term.toLowerCase();
    let nextScore = currentScore;
    if (structuredText.includes(value)) nextScore += 5;
    if (profileText.includes(value)) nextScore += 2;
    return nextScore;
  }, 0);
  for (const group of weightedGroups) {
    for (const term of group.terms || []) {
      const value = String(term || "").toLowerCase();
      if (!value) continue;
      if (structuredText.includes(value)) score += group.weight;
      else if (broadText.includes(value)) score += Math.max(1, Math.floor(group.weight / 2));
    }
  }
  if (Number(row.screening_score || 0) >= 80) score += 1;
  if (Number(row.team_score || 0) >= 80) score += 1;
  if (Number(row.traction_score || 0) >= 75) score += 1;
  return score;
}

function hasNegativeMatch(row, negativeFilters) {
  const filters = uniqueStrings(negativeFilters || [], 8).map((term) => term.toLowerCase());
  if (!filters.length) return false;
  const localized = parseObjectField(row.localized_profile_json);
  const text = [
    row.project_name,
    row.company_name,
    row.industry,
    row.country_or_region,
    row.financing_stage,
    row.customer_type,
    row.revenue_stage,
    row.business_model,
    row.one_line_summary,
    localized.project_name,
    localized.company_name,
    localized.industry,
    localized.one_line_summary,
    ...parseJsonField(row.tags),
    ...parseJsonField(row.ai_category),
    ...parseJsonField(row.team_highlights),
    ...parseJsonField(row.traction),
    ...parseJsonField(row.risks),
    ...parseJsonField(localized.tags),
    ...parseJsonField(localized.team_highlights),
    ...parseJsonField(localized.traction),
    ...parseJsonField(localized.risks),
  ].join(" ").toLowerCase();
  return filters.some((term) => term && text.includes(term));
}

function mergeByDocumentId(primary, secondary) {
  const seen = new Set();
  const result = [];
  for (const row of [...primary, ...secondary]) {
    const id = Number(row.document_id);
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(row);
  }
  return result;
}

async function openFile(id, env) {
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
  if (/^https?:\/\//i.test(document.source_url)) {
    return Response.redirect(document.source_url, 302);
  }
  if (!env.BP_FILES) {
    return json({ error: "R2 bucket binding BP_FILES is not configured." }, 500);
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
  if (name.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
  if (name.endsWith(".pptx")) return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (name.endsWith(".doc")) return "application/msword";
  if (name.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

function fileExtension(fileName) {
  return String(fileName || "").split(".").pop()?.toLowerCase() || "";
}

function formatBytes(value) {
  const bytes = Number(value || 0);
  if (bytes >= 1024 * 1024) return `${Math.round((bytes / 1024 / 1024) * 10) / 10} MB`;
  if (bytes >= 1024) return `${Math.round((bytes / 1024) * 10) / 10} KB`;
  return `${bytes} bytes`;
}

async function ensureScoringTables(env) {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_score_drafts (
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      template_key TEXT NOT NULL DEFAULT 'type_a',
      profile_id INTEGER,
      draft_score INTEGER NOT NULL DEFAULT 0,
      reason TEXT NOT NULL DEFAULT '',
      uncertainty TEXT NOT NULL DEFAULT '',
      dimensions_json TEXT NOT NULL DEFAULT '[]',
      source TEXT NOT NULL DEFAULT 'fallback',
      model TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(document_id, actor, template_key)
    )
  `).run();
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS bp_user_scores (
      document_id INTEGER NOT NULL,
      actor TEXT NOT NULL,
      template_key TEXT NOT NULL DEFAULT 'type_a',
      profile_id INTEGER,
      ai_draft_score INTEGER NOT NULL DEFAULT 0,
      ai_reason TEXT NOT NULL DEFAULT '',
      user_final_score INTEGER NOT NULL DEFAULT 0,
      user_adjustment INTEGER NOT NULL DEFAULT 0,
      adjustment_reason TEXT NOT NULL DEFAULT '',
      dimensions_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(document_id, actor, template_key)
    )
  `).run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_score_drafts_actor_updated ON bp_score_drafts(actor, updated_at)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_bp_user_scores_actor_updated ON bp_user_scores(actor, updated_at)").run();
}

async function attachPersonalScoring(projects, actor, env, templateKey = "type_a") {
  if (!projects?.length || !actor) return;
  await ensureScoringTables(env);
  const template = normalizeScoringTemplate(templateKey);
  const ids = projects.map((project) => Number(project.document_id)).filter((id) => Number.isFinite(id) && id > 0);
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(",");
  const scores = await env.DB.prepare(`
    SELECT * FROM bp_user_scores
    WHERE actor = ? AND template_key = ? AND document_id IN (${placeholders})
  `).bind(actor, template, ...ids).all();
  const drafts = await env.DB.prepare(`
    SELECT * FROM bp_score_drafts
    WHERE actor = ? AND template_key = ? AND document_id IN (${placeholders})
  `).bind(actor, template, ...ids).all();
  const scoreByDocument = new Map((scores.results || []).map((row) => [Number(row.document_id), normalizeUserScore(row)]));
  const draftByDocument = new Map((drafts.results || []).map((row) => [Number(row.document_id), normalizeScoreDraft(row)]));
  for (const project of projects) {
    const userScore = scoreByDocument.get(Number(project.document_id)) || null;
    const draft = draftByDocument.get(Number(project.document_id)) || null;
    const personalScore = userScore?.user_final_score ?? draft?.draft_score ?? Number(project.screening_score || 0);
    project.score_review = { draft, user_score: userScore, status: userScore ? "confirmed" : draft ? "draft" : "none" };
    project.personal_score = personalScore;
    project.personal_score_source = userScore ? "confirmed" : draft ? "draft" : "base";
  }
}

function sortProjectsByPersonalScoring(projects = []) {
  const sourceRank = { confirmed: 3, draft: 2, base: 1 };
  return projects.slice().sort((a, b) => {
    const sourceDiff = (sourceRank[b.personal_score_source] || 0) - (sourceRank[a.personal_score_source] || 0);
    if (sourceDiff) return sourceDiff;
    const scoreDiff = Number(b.personal_score || 0) - Number(a.personal_score || 0);
    if (scoreDiff) return scoreDiff;
    return String(b.updated_at || "").localeCompare(String(a.updated_at || ""));
  });
}

async function getPersonalScoreReview(documentId, actor, env, templateKey = "") {
  await ensureScoringTables(env);
  const template = normalizeScoringTemplate(templateKey);
  const score = await env.DB.prepare(`
    SELECT * FROM bp_user_scores
    WHERE document_id = ? AND actor = ? AND template_key = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `).bind(documentId, actor, template).first();
  const draft = await env.DB.prepare(`
    SELECT * FROM bp_score_drafts
    WHERE document_id = ? AND actor = ? AND template_key = ?
    ORDER BY updated_at DESC
    LIMIT 1
  `).bind(documentId, actor, template).first();
  return {
    draft: normalizeScoreDraft(draft),
    user_score: normalizeUserScore(score),
    status: score ? "confirmed" : draft ? "draft" : "none",
  };
}

function normalizeScoreDraft(row) {
  if (!row) return null;
  return {
    document_id: Number(row.document_id),
    actor: row.actor,
    template_key: row.template_key || "type_a",
    profile_id: row.profile_id || null,
    draft_score: clampScore(row.draft_score),
    reason: row.reason || "",
    uncertainty: row.uncertainty || "",
    dimensions: parseJsonField(row.dimensions_json),
    source: row.source || "fallback",
    model: row.model || "",
    created_at: row.created_at || "",
    updated_at: row.updated_at || "",
  };
}

function normalizeUserScore(row) {
  if (!row) return null;
  return {
    document_id: Number(row.document_id),
    actor: row.actor,
    template_key: row.template_key || "type_a",
    profile_id: row.profile_id || null,
    ai_draft_score: clampScore(row.ai_draft_score),
    ai_reason: row.ai_reason || "",
    user_final_score: clampScore(row.user_final_score),
    user_adjustment: Number(row.user_adjustment || 0),
    adjustment_reason: row.adjustment_reason || "",
    dimensions: parseJsonField(row.dimensions_json),
    created_at: row.created_at || "",
    updated_at: row.updated_at || "",
  };
}

async function scoringStats(actor, env, templateKey = "") {
  await ensureScoringTables(env);
  const template = templateKey ? normalizeScoringTemplate(templateKey) : "";
  const draftWhere = template ? "AND d.template_key = ?" : "";
  const scoreWhere = template ? "AND template_key = ?" : "";
  const draftBindings = template ? [actor, template] : [actor];
  const scoreBindings = template ? [actor, template] : [actor];
  const drafts = await env.DB.prepare(`
    SELECT COUNT(*) AS drafts_waiting
    FROM bp_score_drafts d
    LEFT JOIN bp_user_scores s ON s.document_id = d.document_id AND s.actor = d.actor AND s.template_key = d.template_key
    WHERE d.actor = ? ${draftWhere} AND s.document_id IS NULL
  `).bind(...draftBindings).first();
  const scores = await env.DB.prepare(`
    SELECT
      COUNT(*) AS confirmed_count,
      SUM(CASE WHEN date(updated_at) >= date('now', '-6 days') THEN 1 ELSE 0 END) AS adjusted_this_week,
      MAX(updated_at) AS last_updated_at
    FROM bp_user_scores
    WHERE actor = ? ${scoreWhere}
  `).bind(...scoreBindings).first();
  return {
    drafts_waiting: Number(drafts?.drafts_waiting || 0),
    adjusted_this_week: Number(scores?.adjusted_this_week || 0),
    confirmed_count: Number(scores?.confirmed_count || 0),
    last_updated_at: scores?.last_updated_at || "",
  };
}

async function latestWeightProfileForActor(actor, env) {
  await ensureWeightTables(env);
  const row = await env.DB.prepare(`
    SELECT * FROM weight_profiles
    WHERE owner = ?
    ORDER BY updated_at DESC, id DESC
    LIMIT 1
  `).bind(actor).first();
  return row ? normalizeWeightProfile(row) : null;
}

function summarizeWeightProfile(profile) {
  const factors = (profile?.factors || []).slice(0, 3).map((factor) => `${factor.label?.en || factor.key} ${Number(factor.weight || 0)}%`);
  return {
    title: profile?.title || "",
    factors,
    text: factors.join(" / "),
    updated_at: profile?.updated_at || "",
  };
}

function normalizeScoringTemplate(value) {
  const key = String(value || "type_a").trim().toLowerCase().replace(/\s+/g, "_");
  return ["type_a", "type_b", "type_c", "my_custom"].includes(key) ? key : "type_a";
}

function scoringTemplateLabel(key) {
  return {
    type_a: "Type A",
    type_b: "Type B",
    type_c: "Type C",
    my_custom: "My custom",
  }[normalizeScoringTemplate(key)];
}

async function loadProjectForScoring(documentId, lang, env) {
  const row = await env.DB.prepare(`
    SELECT p.*, d.file_name, d.source_url, t.profile_json AS localized_profile_json
    FROM projects p
    JOIN documents d ON d.id = p.document_id
    LEFT JOIN project_translations t ON t.document_id = p.document_id AND t.lang = ?
    WHERE p.document_id = ?
  `).bind(lang, documentId).first();
  return row ? normalizeProject(row, lang) : null;
}

async function buildScoreDraft(project, profile, templateKey, lang, env) {
  const fallback = fallbackScoreDraft(project, profile, templateKey, lang);
  if (!env.LLM_API_KEY) {
    return { ...fallback, warning: "LLM_API_KEY is not configured. Used structured fallback draft." };
  }
  const result = await callChatCompletion(env, {
    temperature: 0.15,
    maxTokens: 900,
    messages: [
      {
        role: "system",
        content: `You are VRT Agent. You only draft BP scores for a VC reviewer; you never make final scores. Return JSON only. User-facing text must be in ${lang === "zh" ? "Chinese" : "English"}.`,
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "Draft a suggested score, reason, uncertainty, and dimension suggestions. The user makes the final call.",
          template: scoringTemplateLabel(templateKey),
          profile: profile ? { title: profile.title, factors: profile.factors } : null,
          project: {
            project_name: project.project_name,
            company_name: project.company_name,
            industry: project.industry,
            financing_stage: project.financing_stage,
            business_model: project.business_model,
            screening_score: project.screening_score,
            team_score: project.team_score,
            traction_score: project.traction_score,
            risk_level: project.risk_level,
            recommendation: project.recommendation,
            summary: project.one_line_summary,
            team_highlights: project.team_highlights,
            traction: project.traction,
            risks: project.risks,
          },
          json_schema: {
            draft_score: "integer 0-100",
            reason: "short reason",
            uncertainty: "what is uncertain or missing",
            dimensions: [{ key: "string", label: "string", suggested_score: "integer 0-100", reason: "string", uncertainty: "string" }],
          },
        }),
      },
    ],
  });
  const parsed = result.ok ? parseLlmJson(result.content) : null;
  if (!parsed || !Number.isFinite(Number(parsed.draft_score))) {
    return { ...fallback, warning: result.ok ? "Draft model returned invalid JSON. Used structured fallback draft." : result.error };
  }
  return {
    draft_score: clampScore(parsed.draft_score),
    reason: String(parsed.reason || fallback.reason).slice(0, 2000),
    uncertainty: String(parsed.uncertainty || fallback.uncertainty).slice(0, 1200),
    dimensions: normalizeDraftDimensions(parsed.dimensions, fallback.dimensions),
    source: "llm",
    model: llmModel(env),
  };
}

function fallbackScoreDraft(project, profile, templateKey, lang) {
  const baseScore = profile ? rankProjectsByProfile([project], { ...profile, factors_json: JSON.stringify(profile.factors || []) })[0]?.custom_rank_score : Number(project.screening_score || 0);
  const riskPenalty = project.risk_level === "高" ? 8 : project.risk_level === "中" ? 3 : 0;
  const templateBias = normalizeScoringTemplate(templateKey) === "type_b" ? 2 : normalizeScoringTemplate(templateKey) === "type_c" ? -2 : 0;
  const draftScore = clampScore(Number(baseScore || 0) - riskPenalty + templateBias);
  const isZh = lang === "zh";
  const dimensions = normalizeDraftDimensions([
    {
      key: "overall_fit",
      label: isZh ? "综合匹配" : "Overall fit",
      suggested_score: draftScore,
      reason: isZh ? "基于当前综合筛选分、模板和风险折扣生成建议。" : "Suggested from screening score, template, and risk discount.",
      uncertainty: isZh ? "需要用户结合原 BP 与个人偏好确认。" : "Reviewer should confirm against the BP and personal preference.",
    },
    {
      key: "team",
      label: isZh ? "团队" : "Team",
      suggested_score: clampScore(project.team_score),
      reason: joinForPrompt(project.team_highlights) || (isZh ? "沿用结构化团队分。" : "Used structured team score."),
      uncertainty: isZh ? "创始人履历和互补性可能需要人工复核。" : "Founder background and complementarity may need review.",
    },
    {
      key: "traction",
      label: isZh ? "进展" : "Traction",
      suggested_score: clampScore(project.traction_score),
      reason: joinForPrompt(project.traction) || (isZh ? "沿用结构化进展分。" : "Used structured traction score."),
      uncertainty: isZh ? "客户、收入和留存证据可能不足。" : "Customer, revenue, and retention evidence may be incomplete.",
    },
  ]);
  return {
    draft_score: draftScore,
    reason: isZh
      ? `VRT Agent 仅生成草稿：${project.project_name || project.company_name || "该 BP"} 的结构化信号建议为 ${draftScore} 分，最终分由你确认。`
      : `VRT Agent only drafts: structured signals suggest ${draftScore} for ${project.project_name || project.company_name || "this BP"}; you make the final call.`,
    uncertainty: isZh ? "未确认信息、行业判断和个人偏好可能改变最终分。" : "Missing facts, sector judgment, and personal preference may change the final score.",
    dimensions,
    source: "fallback",
    model: "",
  };
}

function normalizeDraftDimensions(input, fallback = []) {
  const source = Array.isArray(input) && input.length ? input : fallback;
  return (source || []).slice(0, 8).map((item, index) => ({
    key: safeFactorKey(item.key || `dimension_${index + 1}`),
    label: String(item.label || item.name || item.key || `Dimension ${index + 1}`).slice(0, 80),
    suggested_score: clampScore(item.suggested_score ?? item.score ?? item.draft_score),
    user_final_score: Number.isFinite(Number(item.user_final_score)) ? clampScore(item.user_final_score) : clampScore(item.suggested_score ?? item.score ?? item.draft_score),
    reason: String(item.reason || "").slice(0, 600),
    uncertainty: String(item.uncertainty || "").slice(0, 400),
  }));
}

async function upsertScoreDraft(env, { document_id, actor, template_key, profile_id, draft }) {
  await env.DB.prepare(`
    INSERT INTO bp_score_drafts(
      document_id, actor, template_key, profile_id, draft_score, reason, uncertainty,
      dimensions_json, source, model, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(document_id, actor, template_key) DO UPDATE SET
      profile_id = excluded.profile_id,
      draft_score = excluded.draft_score,
      reason = excluded.reason,
      uncertainty = excluded.uncertainty,
      dimensions_json = excluded.dimensions_json,
      source = excluded.source,
      model = excluded.model,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    document_id,
    actor,
    template_key,
    profile_id,
    clampScore(draft.draft_score),
    String(draft.reason || "").slice(0, 2000),
    String(draft.uncertainty || "").slice(0, 1200),
    JSON.stringify(normalizeDraftDimensions(draft.dimensions)),
    draft.source || "fallback",
    draft.model || "",
  ).run();
}

function normalizeProject(row, lang = "en") {
  const localized = parseObjectField(row.localized_profile_json);
  const merged = {
    ...row,
    ...localized,
    id: row.id,
    document_id: row.document_id,
    file_name: row.file_name,
    source_url: row.source_url,
    library_number: Number(row.library_number || 0),
    document_created_at: row.document_created_at || row.created_at || "",
    ai_related: row.ai_related,
    screening_score: row.screening_score,
    team_score: row.team_score,
    traction_score: row.traction_score,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
  delete merged.localized_profile_json;
  const documentTitle = firstProjectText(
    merged.document_title,
    merged.title,
    merged.project_name,
    merged.company_name,
    merged.file_name,
  );
  const normalized = {
    ...merged,
    document_title: documentTitle,
    ai_related: Boolean(merged.ai_related),
    ai_category: parseJsonField(merged.ai_category),
    team_highlights: parseJsonField(merged.team_highlights),
    traction: parseJsonField(merged.traction),
    risks: parseJsonField(merged.risks),
    tags: parseJsonField(merged.tags),
    evidence: parseJsonField(merged.evidence),
  };
  return lang === "zh" ? normalized : sanitizeEnglishProjectDisplay(normalized);
}

function sanitizeEnglishProjectDisplay(project) {
  const clean = { ...project };
  for (const field of ["project_name", "company_name", "document_title", "title", "one_liner", "one_line_summary", "summary", "profile_summary"]) {
    if (hasCjkText(clean[field])) clean[field] = "";
  }
  const fallbackTitle = firstEnglishProjectText(clean.document_title, clean.title, clean.file_name) || untitledBpLabel(clean.library_number);
  clean.document_title = clean.document_title || fallbackTitle;
  clean.title = clean.title || fallbackTitle;
  return clean;
}

function listProjectDto(project, lang = "en") {
  const textForLang = lang === "zh" ? firstProjectText : firstEnglishProjectText;
  const summary = textForLang(project.one_line_summary, project.summary, project.one_liner, project.business_model);
  const title = textForLang(project.title, project.document_title, project.file_name) || (lang === "zh" ? "" : untitledBpLabel(project.library_number));
  const documentTitle = textForLang(project.document_title, project.file_name) || title;
  return {
    id: project.id,
    document_id: project.document_id,
    library_number: project.library_number,
    project_name: textForLang(project.project_name),
    company_name: textForLang(project.company_name),
    industry: project.industry,
    country_or_region: project.country_or_region,
    financing_stage: project.financing_stage,
    customer_type: project.customer_type,
    revenue_stage: project.revenue_stage,
    recommendation: project.recommendation,
    risk_level: project.risk_level,
    ai_related: Boolean(project.ai_related),
    tags: (project.tags || []).slice(0, 12),
    summary,
    one_liner: project.one_liner || "",
    title,
    document_title: documentTitle,
    one_line_summary: project.one_line_summary || summary,
    business_model: project.business_model,
    team_highlights: (project.team_highlights || []).slice(0, 4),
    traction: (project.traction || []).slice(0, 4),
    risks: (project.risks || []).slice(0, 4),
    screening_score: project.screening_score,
    team_score: project.team_score,
    traction_score: project.traction_score,
    personal_score: project.personal_score,
    personal_score_source: project.personal_score_source,
    custom_rank_score: project.custom_rank_score,
    operational_penalty: project.operational_penalty,
    file_name: project.file_name,
    source_url: project.source_url,
    document_created_at: project.document_created_at,
    updated_at: project.updated_at,
    collaboration: project.collaboration,
    ops: project.ops,
  };
}

function parseJsonField(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return String(value)
      .split(/[\n\r,，;；|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function firstProjectText(...values) {
  for (const value of values) {
    const text = Array.isArray(value) ? value.filter(Boolean).join(" / ") : String(value || "");
    const normalized = text.replace(/\s+/g, " ").trim();
    if (normalized && !/^(unknown|n\/a|na|null|none|undefined|-+|未知|不详|未披露)$/i.test(normalized)) {
      return normalized;
    }
  }
  return "";
}

function firstEnglishProjectText(...values) {
  return firstProjectText(...values.filter((value) => !hasCjkText(value)));
}

function hasCjkText(value) {
  const text = Array.isArray(value) ? value.filter(Boolean).join(" / ") : String(value || "");
  return /[\u3400-\u9fff]/.test(text);
}

function untitledBpLabel(libraryNumber = 0) {
  const number = Number(libraryNumber || 0);
  return number > 0 ? `Untitled BP #${number}` : "Untitled BP";
}

function parseObjectField(value) {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function requestClientMetadata(request, body = {}) {
  const metadata = parseObjectField(body.metadata);
  const timezone = String(body.timezone || request.headers.get("x-bp-timezone") || metadata.timezone || "").trim();
  const locale = String(body.locale || request.headers.get("x-bp-locale") || metadata.locale || "").trim();
  if (timezone) metadata.timezone = timezone.slice(0, 80);
  if (locale) metadata.locale = locale.slice(0, 40);
  return metadata;
}

function localizedLang(value) {
  return value === "zh" ? "zh" : "en";
}

function keywordSearchTerms(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return [];
  const terms = normalized
    .split(/[\s,;|/]+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .slice(0, 8);
  return terms.length ? terms : [normalized];
}

function likeTerm(value) {
  return `%${String(value || "").trim()}%`;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...extraHeaders,
    },
  });
}

function internalErrorResponse(error, env) {
  const payload = { error: "Internal server error." };
  if (envFlag(env.DEBUG_ERRORS)) {
    payload.detail = String(error?.message || error || "").slice(0, 300);
  }
  return json(payload, 500);
}

function envFlag(value) {
  return /^(1|true|yes|on)$/i.test(String(value || "").trim());
}
