CREATE TABLE problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  leetcode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  leetcode_difficulty TEXT NOT NULL CHECK (leetcode_difficulty IN ('easy', 'medium', 'hard')),
  pattern_id TEXT NOT NULL,
  subpattern_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, leetcode_number)
);

CREATE INDEX idx_problems_user_id ON problems(user_id);
CREATE INDEX idx_problems_pattern_id ON problems(pattern_id);
