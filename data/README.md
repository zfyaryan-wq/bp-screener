# Data Directory

This directory is for local source files, generated exports, and operator scratch data. Keep it out of normal commits unless a file is explicitly documented as a small, non-sensitive fixture.

## Generated Files

Do not commit generated `data/*.sql` or `data/*.json` files. They may contain large D1 exports, Feishu metadata, source document names, project details, or other sensitive review data.

Common generated outputs:

- `data/d1_seed.sql`: local SQLite to D1 seed export from `scripts/sync_to_d1.py`.
- `data/project_translations_upsert.sql`: generated translation upserts from `scripts/build_translations.py`.
- `data/framework_factors.json`: parsed framework factor data from `scripts/import_framework_factors.py`.
- `data/framework_factors_import.sql`: D1 import SQL for framework factors.
- `data/feishu_files.json`: Feishu Drive file index from `scripts/feishu_sync.py`.

## Regeneration

Regenerate data from the source systems instead of editing committed snapshots:

```powershell
python scripts\sync_to_d1.py
python scripts\build_translations.py --help
python scripts\import_framework_factors.py --help
python scripts\feishu_sync.py --help
```

Use each script's dry-run/default mode first. Only run commands with `--execute`, `--apply`, or remote Wrangler writes after confirming the target environment and expected diff.

## Commit Policy

- Commit this README and empty `.gitkeep` placeholders only.
- Do not commit raw BP files, Feishu indexes, D1 exports, generated import SQL, or files that include personal data.
- If a tiny sanitized fixture is ever needed for tests, place it in a purpose-specific test fixture directory and document how it was sanitized.
