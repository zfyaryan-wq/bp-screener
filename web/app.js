const labels = {
  en: {
    eyebrow: "Four-Person BP Review Workspace",
    title: "BP Screener Workbench",
    subtitle:
      "A lightweight shared workbench for our four-person student team to review pitch decks, filter structured profiles, and inspect source evidence.",
    keyword: "Keyword",
    industry: "Industry",
    stage: "Stage",
    recommendation: "Recommendation",
    any: "Any",
    high: "High",
    medium: "Medium",
    low: "Low",
    unknown: "Unknown",
    aiOnly: "AI-related only",
    search: "Search",
    projects: "Projects",
    aiProjects: "AI-related",
    sourceSearch: "Source Snippet Search",
    searchSnippets: "Search snippets",
    charts: "Workbench Overview",
    loginTitle: "Enter password",
    loginHint: "Use the shared access password to view project data.",
    loginButton: "Enter",
    loginFailed: "Invalid password. Please try again.",
    industryChart: "Industry",
    stageChart: "Financing Stage",
    recommendationChart: "Recommendation",
    aiChart: "AI Related",
    noProjects: "No projects found. Add BP files locally, analyze them, then sync data to D1.",
    view: "View details",
    openFile: "Open file",
    file: "File",
    stageLabel: "Stage",
    businessModel: "Business Model",
    team: "Team Highlights",
    traction: "Traction",
    risks: "Risks",
    evidence: "Evidence",
    page: "Page",
  },
  zh: {
    eyebrow: "四人小组 BP 协作工作台",
    title: "BP Screener 工作台",
    subtitle: "给四人学生小组协作用的轻量工作台，用于查看结构化 BP 项目档案、筛选项目和检查原文证据。",
    keyword: "关键词",
    industry: "行业",
    stage: "阶段",
    recommendation: "推荐等级",
    any: "不限",
    high: "高",
    medium: "中",
    low: "低",
    unknown: "未知",
    aiOnly: "只看 AI 相关",
    search: "搜索",
    projects: "项目",
    aiProjects: "AI 相关",
    sourceSearch: "原文片段搜索",
    searchSnippets: "搜索片段",
    charts: "工作台概览",
    loginTitle: "输入密码",
    loginHint: "输入共享访问密码后查看项目数据。",
    loginButton: "进入",
    loginFailed: "密码不正确，请重试。",
    industryChart: "行业分布",
    stageChart: "融资阶段",
    recommendationChart: "推荐等级",
    aiChart: "AI 相关占比",
    noProjects: "还没有项目。请先在本地添加并分析 BP，再把数据同步到 D1。",
    view: "查看详情",
    openFile: "打开原文件",
    file: "文件",
    stageLabel: "阶段",
    businessModel: "商业模式",
    team: "团队亮点",
    traction: "当前进展",
    risks: "风险",
    evidence: "证据",
    page: "第",
  },
};

let lang = localStorage.getItem("bp-screener-lang") || "en";
let accessPassword = localStorage.getItem("bp-screener-password") || "";
let projects = [];

const language = document.querySelector("#language");
const grid = document.querySelector("#projectGrid");
const snippetList = document.querySelector("#snippetList");
const dialog = document.querySelector("#projectDialog");
const detail = document.querySelector("#projectDetail");
const loginOverlay = document.querySelector("#loginOverlay");
const loginForm = document.querySelector("#loginForm");
const passwordInput = document.querySelector("#passwordInput");
const loginError = document.querySelector("#loginError");

language.value = lang;
language.addEventListener("change", () => {
  lang = language.value;
  localStorage.setItem("bp-screener-lang", lang);
  applyLanguage();
  renderProjects(projects);
  renderCharts(projects);
});

document.querySelector("#searchButton").addEventListener("click", loadProjects);
document.querySelector("#snippetButton").addEventListener("click", searchSnippets);
document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  accessPassword = passwordInput.value.trim();
  localStorage.setItem("bp-screener-password", accessPassword);
  loginError.textContent = "";
  await loadProjects();
});

applyLanguage();
if (accessPassword) {
  loginOverlay.classList.add("hidden");
  loadProjects();
} else {
  passwordInput.focus();
}

function t(key) {
  return labels[lang][key] || key;
}

function applyLanguage() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
}

async function loadProjects() {
  const params = new URLSearchParams();
  setParam(params, "q", value("#keyword"));
  setParam(params, "industry", value("#industry"));
  setParam(params, "stage", value("#stage"));
  setParam(params, "recommendation", value("#recommendation"));
  if (document.querySelector("#aiOnly").checked) params.set("aiOnly", "true");

  const response = await apiFetch(`/api/projects?${params.toString()}`);
  if (!response) return;
  const data = await response.json();
  projects = data.projects || [];
  renderProjects(projects);
  renderCharts(projects);
}

async function searchSnippets() {
  const q = value("#keyword");
  if (!q) {
    snippetList.innerHTML = "";
    return;
  }
  const response = await apiFetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!response) return;
  const data = await response.json();
  const snippets = data.snippets || [];
  snippetList.innerHTML = snippets
    .map(
      (item) => `
        <article class="snippet">
          <strong>${escapeHtml(item.file_name || "")}</strong>
          <p>${t("page")} ${item.page || t("unknown")}</p>
          <p>${escapeHtml(item.snippet || "")}</p>
        </article>
      `,
    )
    .join("");
}

function renderProjects(items) {
  document.querySelector("#projectCount").textContent = String(items.length);
  document.querySelector("#aiCount").textContent = String(items.filter((item) => item.ai_related).length);

  if (!items.length) {
    grid.innerHTML = `<div class="panel card">${t("noProjects")}</div>`;
    return;
  }

  grid.innerHTML = items.map(projectCard).join("");
  grid.querySelectorAll("[data-document-id]").forEach((button) => {
    button.addEventListener("click", () => showProject(button.dataset.documentId));
  });
  grid.querySelectorAll("[data-file-id]").forEach((button) => {
    button.addEventListener("click", () => openSourceFile(button.dataset.fileId));
  });
}

function projectCard(project) {
  const tags = [
    project.industry,
    project.financing_stage,
    project.ai_related ? "AI" : "",
    ...(project.tags || []).slice(0, 3),
  ].filter(Boolean);

  return `
    <article class="card">
      <h3>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</h3>
      <p class="summary">${escapeHtml(project.one_line_summary || "")}</p>
      <div class="tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="meta">
        <span><strong>${t("stageLabel")}:</strong> ${escapeHtml(project.financing_stage || t("unknown"))}</span>
        <span><strong>${t("businessModel")}:</strong> ${escapeHtml(project.business_model || t("unknown"))}</span>
        <span><strong>${t("file")}:</strong> ${escapeHtml(project.file_name || "")}</span>
      </div>
      <button data-document-id="${project.document_id}">${t("view")}</button>
      ${project.source_url ? `<button data-file-id="${project.document_id}" class="secondary">${t("openFile")}</button>` : ""}
    </article>
  `;
}

async function showProject(documentId) {
  const response = await apiFetch(`/api/projects/${documentId}`);
  if (!response) return;
  const data = await response.json();
  const project = data.project;
  if (!project) return;

  detail.innerHTML = `
    <h2>${escapeHtml(project.project_name || project.company_name || t("unknown"))}</h2>
    <p class="summary">${escapeHtml(project.one_line_summary || "")}</p>
    <div class="detailGrid">
      ${detailItem(t("industry"), project.industry)}
      ${detailItem("AI", project.ai_related ? "Yes" : "No")}
      ${detailItem(t("stageLabel"), project.financing_stage)}
      ${detailItem(t("businessModel"), project.business_model)}
      ${detailItem(t("team"), join(project.team_highlights))}
      ${detailItem(t("traction"), join(project.traction))}
      ${detailItem(t("risks"), join(project.risks))}
      ${detailItem(t("file"), project.file_name)}
    </div>
    ${project.source_url ? `<button id="detailOpenFile" data-file-id="${project.document_id}">${t("openFile")}</button>` : ""}
    ${
      project.evidence?.length
        ? `<h3>${t("evidence")}</h3><ul>${project.evidence
            .map((item) => `<li>${escapeHtml(item.quote || "")}</li>`)
            .join("")}</ul>`
        : ""
    }
  `;
  detail.querySelector("#detailOpenFile")?.addEventListener("click", (event) => {
    openSourceFile(event.currentTarget.dataset.fileId);
  });
  dialog.showModal();
}

function openSourceFile(documentId) {
  fetch(`/api/files/${documentId}`, {
    headers: {
      "x-bp-password": accessPassword,
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("File unavailable");
      return response.blob();
    })
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    })
    .catch(() => alert(lang === "zh" ? "原文件暂不可用" : "Source file is not available yet"));
}

async function apiFetch(url) {
  const response = await fetch(url, {
    headers: {
      "x-bp-password": accessPassword,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("bp-screener-password");
    loginOverlay.classList.remove("hidden");
    loginError.textContent = t("loginFailed");
    passwordInput.focus();
    return null;
  }
  return response;
}

function renderCharts(items) {
  const chartGrid = document.querySelector("#chartGrid");
  chartGrid.innerHTML = [
    donutChart(t("aiChart"), items.filter((item) => item.ai_related).length, items.length),
    barChart(t("industryChart"), countBy(items, "industry")),
    barChart(t("stageChart"), countBy(items, "financing_stage")),
    barChart(t("recommendationChart"), countBy(items, "recommendation")),
  ].join("");
}

function countBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const raw = String(item[key] || t("unknown"));
    const parts = raw.split(/[；/|,，]/).map((part) => part.trim()).filter(Boolean);
    const value = parts[0] || t("unknown");
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
}

function barChart(title, rows) {
  const max = Math.max(1, ...rows.map(([, count]) => count));
  return `
    <article class="chartCard">
      <h3>${escapeHtml(title)}</h3>
      ${rows
        .map(
          ([name, count]) => `
            <div class="barRow">
              <span title="${escapeHtml(name)}">${escapeHtml(shorten(name))}</span>
              <div class="barTrack"><div class="barFill" style="width:${(count / max) * 100}%"></div></div>
              <strong>${count}</strong>
            </div>
          `,
        )
        .join("")}
    </article>
  `;
}

function donutChart(title, value, total) {
  const percent = total ? Math.round((value / total) * 100) : 0;
  return `
    <article class="chartCard">
      <h3>${escapeHtml(title)}</h3>
      <div class="donut" style="--value:${percent}%"></div>
      <div class="donutLabel"><strong>${percent}%</strong> · ${value}/${total}</div>
    </article>
  `;
}

function shorten(value) {
  const text = String(value || "");
  return text.length > 14 ? `${text.slice(0, 13)}…` : text;
}

function detailItem(label, value) {
  return `<div class="detailItem"><small>${escapeHtml(label)}</small>${escapeHtml(value || t("unknown"))}</div>`;
}

function join(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function value(selector) {
  return document.querySelector(selector).value.trim();
}

function setParam(params, key, item) {
  if (item) params.set(key, item);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
