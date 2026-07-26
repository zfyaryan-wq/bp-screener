# Architecture Runbook

BP Screener is sized for a five-person review team. Keep the system simple: Cloudflare Pages serves the frontend, `web/_worker.js` handles API and auth, D1 is the primary application database, and Feishu Drive is only the original BP file repository.

## Production Data Rules

- D1 is the source of truth for projects, review state, scores, shortlist, nominations, comments, and access-code metadata.
- Feishu stores uploaded source files. Do not treat Feishu Bitable or Drive metadata as the primary application database.
- Online BP upload writes `documents(status='uploaded')` and one `ingest_jobs(status='queued')` row in D1. Workers and local agents should consume `ingest_jobs` instead of inferring pending work from `documents` alone.
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

## Upload Ingestion Loop

The first production-safe upload loop is intentionally small:

1. `/api/upload` uploads the original BP file to Feishu Drive.
2. The Worker inserts a D1 `documents` row with `source_platform='feishu'`, `source_external_id=<file token>`, and `status='uploaded'`.
3. The Worker creates or refreshes the matching `ingest_jobs` row with `status='queued'` and returns that job to the frontend. It also attempts to record a wake request when the wake table is available, but queued D1 state is the durable handoff.
4. A local or background operator runs `python scripts\process_ingest_jobs.py list` or `status` to inspect pending work, then `claim --apply` to move selected jobs to `processing`.
5. The next integration step is to download the Feishu file with app credentials, feed it into `bp_screener.ingest`, and sync structured `documents/projects/chunks/project_translations` results back to D1. Do not hard-code Feishu or Cloudflare secrets in the script.

Useful commands:

```powershell
npx wrangler d1 execute bp-screener --remote --file cloudflare\migrate_ingest_jobs.sql
.\.venv\Scripts\python.exe scripts\process_ingest_jobs.py status
.\.venv\Scripts\python.exe scripts\process_ingest_jobs.py list --status queued --limit 20
.\.venv\Scripts\python.exe scripts\process_ingest_jobs.py claim --limit 1
.\.venv\Scripts\python.exe scripts\process_ingest_jobs.py claim --limit 1 --apply
```

## Next Small Refactors

Keep refactors incremental:

1. Move auth/session helpers out of `web/_worker.js` into a small module when the build setup supports worker modules cleanly.
2. Split review-board queries from scoring endpoints before adding heavier leaderboard features.
3. Split `web/app.js` by screen area only after the current startup path and auth behavior are stable.
