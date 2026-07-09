DROP TABLE IF EXISTS chunks;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS documents;

CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  file_name TEXT NOT NULL,
  source_url TEXT,
  file_size INTEGER NOT NULL DEFAULT 0,
  created_at TEXT,
  updated_at TEXT
);

CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL UNIQUE,
  project_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  ai_related INTEGER NOT NULL DEFAULT 0,
  ai_category TEXT NOT NULL DEFAULT '[]',
  financing_stage TEXT NOT NULL,
  business_model TEXT NOT NULL,
  team_highlights TEXT NOT NULL DEFAULT '[]',
  traction TEXT NOT NULL DEFAULT '[]',
  customers_or_users TEXT NOT NULL,
  revenue_or_financials TEXT NOT NULL,
  one_line_summary TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  risks TEXT NOT NULL DEFAULT '[]',
  tags TEXT NOT NULL DEFAULT '[]',
  evidence TEXT NOT NULL DEFAULT '[]',
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE TABLE chunks (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL,
  page INTEGER,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY(document_id) REFERENCES documents(id)
);

CREATE INDEX idx_projects_ai_related ON projects(ai_related);
CREATE INDEX idx_projects_industry ON projects(industry);
CREATE INDEX idx_projects_stage ON projects(financing_stage);
CREATE INDEX idx_projects_recommendation ON projects(recommendation);
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
