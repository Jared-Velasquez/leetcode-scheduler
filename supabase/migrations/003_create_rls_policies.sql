ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE solves ENABLE ROW LEVEL SECURITY;

-- Problems: users can only access their own
CREATE POLICY "Users can CRUD own problems" ON problems
  FOR ALL USING (auth.uid() = user_id);

-- Solves: users can only access their own
CREATE POLICY "Users can CRUD own solves" ON solves
  FOR ALL USING (auth.uid() = user_id);
