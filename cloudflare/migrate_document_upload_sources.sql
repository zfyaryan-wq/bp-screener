ALTER TABLE documents ADD COLUMN source_platform TEXT NOT NULL DEFAULT '';
ALTER TABLE documents ADD COLUMN source_external_id TEXT NOT NULL DEFAULT '';
ALTER TABLE documents ADD COLUMN status TEXT NOT NULL DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_documents_status_updated ON documents(status, updated_at);
CREATE INDEX IF NOT EXISTS idx_documents_source_external ON documents(source_platform, source_external_id);
