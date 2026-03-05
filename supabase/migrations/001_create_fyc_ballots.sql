CREATE TABLE fyc_ballots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  archetype TEXT NOT NULL CHECK (archetype IN ('film-bro','chaos-agent','safe-picker','underdog-stan')),
  picks JSONB NOT NULL DEFAULT '{}',
  chaos_score INTEGER NOT NULL DEFAULT 50 CHECK (chaos_score BETWEEN 0 AND 100),
  final_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fyc_ballots ENABLE ROW LEVEL SECURITY;

-- Read-only public access. Writes go through server API routes (service-role bypasses RLS).
CREATE POLICY "fyc_anyone_can_read" ON fyc_ballots FOR SELECT USING (true);

-- Prevent JSONB from getting too large
ALTER TABLE fyc_ballots ADD CONSTRAINT fyc_picks_max_size CHECK (octet_length(picks::text) <= 4096);

-- Indexes for dashboard queries
CREATE INDEX idx_fyc_ballots_archetype ON fyc_ballots(archetype);
CREATE INDEX idx_fyc_ballots_created_at ON fyc_ballots(created_at);
