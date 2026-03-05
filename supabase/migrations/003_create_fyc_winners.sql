-- Winners table for ceremony night live results
CREATE TABLE IF NOT EXISTS fyc_winners (
  category_id TEXT PRIMARY KEY,
  nominee_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public read access, service-role write
ALTER TABLE fyc_winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON fyc_winners FOR SELECT USING (true);
