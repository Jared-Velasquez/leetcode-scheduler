CREATE TABLE solves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  solved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  personal_difficulty INTEGER NOT NULL CHECK (personal_difficulty BETWEEN 1 AND 5),
  time_complexity TEXT NOT NULL,
  space_complexity TEXT NOT NULL,
  pseudocode TEXT,
  notes TEXT,
  easiness_factor DECIMAL(4,2) NOT NULL DEFAULT 2.5,
  interval INTEGER NOT NULL DEFAULT 0,
  repetition INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_solves_problem_id ON solves(problem_id);
CREATE INDEX idx_solves_user_id ON solves(user_id);
