CREATE TABLE fyc_events (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_name TEXT NOT NULL CHECK (event_name IN (
    'quiz-completed','ballot-completed','card-shared',
    'card-downloaded','sinners-picked','cemetery-visited','tombstone-shared'
  )),
  session_id UUID,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE fyc_events ENABLE ROW LEVEL SECURITY;

-- Read-only public access. Writes go through server API route (service-role bypasses RLS).
CREATE POLICY "fyc_events_anyone_can_read" ON fyc_events FOR SELECT USING (true);

-- Prevent metadata from getting too large
ALTER TABLE fyc_events ADD CONSTRAINT fyc_events_metadata_max_size CHECK (octet_length(metadata::text) <= 1024);

-- Indexes for dashboard queries
CREATE INDEX idx_fyc_events_name ON fyc_events(event_name);
CREATE INDEX idx_fyc_events_created_at ON fyc_events(created_at);
