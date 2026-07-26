CREATE TABLE IF NOT EXISTS project_translations (
  document_id INTEGER NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  profile_json TEXT NOT NULL,
  created_at TEXT,
  updated_at TEXT,
  PRIMARY KEY(document_id, lang),
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE INDEX IF NOT EXISTS idx_project_translations_lang ON project_translations(lang);
