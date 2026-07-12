const form = document.querySelector("#wakeForm");
const message = document.querySelector("#message");
const statusDot = document.querySelector("#statusDot");
const statusText = document.querySelector("#statusText");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await requestWake();
});

checkStatus();
setInterval(checkStatus, 5000);

async function checkStatus() {
  try {
    const response = await fetch("/api/wake/status", { cache: "no-store" });
    const state = await response.json();
    renderStatus(state);

    if (state.status === "online" && state.latest_url && isFresh(state.last_seen_at)) {
      message.textContent = "Opening...";
      window.location.href = "/workbench/";
    }
  } catch (error) {
    setStatus("offline", "Offline");
  }
}

async function requestWake() {
  setBusy(true);
  message.textContent = "Starting...";
  try {
    const response = await fetch("/api/wake/request", {
      method: "POST",
    });
    if (!response.ok) {
      throw new Error("Failed.");
    }
    await checkStatus();
  } catch (error) {
    message.textContent = error.message;
  } finally {
    setBusy(false);
  }
}

function renderStatus(state) {
  if (state.status === "online" && state.latest_url && isFresh(state.last_seen_at)) {
    setStatus("online", "Online");
    return;
  }
  if (state.status === "starting") {
    setStatus("starting", "Starting...");
    return;
  }
  setStatus("offline", "Offline");
}

function setStatus(status, text) {
  statusDot.className = `dot ${status}`;
  statusText.textContent = text;
}

function setBusy(isBusy) {
  form.querySelector("button").disabled = isBusy;
}

function isFresh(value) {
  if (!value) return false;
  const seen = new Date(`${value}Z`).getTime();
  if (!Number.isFinite(seen)) return false;
  return Date.now() - seen < 5 * 60 * 1000;
}
