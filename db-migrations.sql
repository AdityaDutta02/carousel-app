CREATE TABLE IF NOT EXISTS carousel_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  viewer_id   TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  topic       TEXT NOT NULL,
  handle      TEXT NOT NULL,
  page_name   TEXT NOT NULL,
  theme       TEXT NOT NULL DEFAULT 'default',
  slides      JSONB NOT NULL DEFAULT '[]',
  export_id   TEXT NOT NULL DEFAULT '',
  slide_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS carousel_history_viewer_idx
  ON carousel_history(viewer_id, created_at DESC);
