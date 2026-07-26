# Architecture Runbook

BP Screener is sized for a five-person review team. Keep the system simple: Cloudflare Pages serves the frontend, `web/_worker.js` handles API and auth, D1 is the primary application database, and Feishu Drive is only the original BP file repository.

## Production Data Rules

- D1 is the source of truth for projects, review state, scores, shortlist, nominations, comments, and access-code metadata.
- Feishu stores uploaded source files. Do not treat Feishu Bitable or Drive metadata as the primary application database.
- `scripts/sync_to_d1.py` defaults to data-only `INSERT OR REPLACE` SQL. Do not run destructive schema resets in production.
- Only run `python scripts\sync_to_d1.py --reset-schema --allow-drop --execute` against disposable or explicitly approved environments.

## Auth Rules

- The web app uses the five known team members plus a personal access code or short session token.
- Configure initial access through `BP_ACCESS_CODES` in Cloudflare secrets, or intentionally enable `BP_ALLOW_ACCESS_CODE_BOOTSTRAP=true` for a controlled bootstrap window.
- Do not add Feishu OAuth unless the team outgrows this simple access-code model.
- `/api/wake/*` and `/workbench` are protected by the same team session.

## Product Boundaries

- VRT Agent recommends, summarizes, and drafts score reviews. It must not automatically decide nominations, votes, final scores, or meeting selections.
- WhatsApp is not part of the core workflow for now. Keep discussion and review state inside the app/D1.

## Next Small Refactors

Keep refactors incremental:

1. Move auth/session helpers out of `web/_worker.js` into a small module when the build setup supports worker modules cleanly.
2. Split review-board queries from scoring endpoints before adding heavier leaderboard features.
3. Split `web/app.js` by screen area only after the current startup path and auth behavior are stable.
