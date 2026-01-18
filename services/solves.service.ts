import { SupabaseClient } from '@supabase/supabase-js';
import { Solve, CreateSolveDTO, PersonalDifficulty } from '@/types';
import { calculateSM2FromDifficulty } from '@/lib/algorithms/sm2';

interface DbSolve {
  id: string;
  problem_id: string;
  user_id: string;
  solved_at: string;
  personal_difficulty: number;
  time_complexity: string;
  space_complexity: string;
  pseudocode: string | null;
  notes: string | null;
  easiness_factor: number;
  interval: number;
  repetition: number;
  created_at: string;
}

function mapDbToSolve(db: DbSolve): Solve {
  return {
    id: db.id,
    problemId: db.problem_id,
    userId: db.user_id,
    solvedAt: new Date(db.solved_at),
    personalDifficulty: db.personal_difficulty as PersonalDifficulty,
    timeComplexity: db.time_complexity,
    spaceComplexity: db.space_complexity,
    pseudocode: db.pseudocode ?? undefined,
    notes: db.notes ?? undefined,
    easinessFactor: db.easiness_factor,
    interval: db.interval,
    repetition: db.repetition,
    createdAt: new Date(db.created_at),
  };
}

export async function getSolvesForProblem(
  supabase: SupabaseClient,
  problemId: string
): Promise<Solve[]> {
  const { data, error } = await supabase
    .from('solves')
    .select('*')
    .eq('problem_id', problemId)
    .order('solved_at', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DbSolve[]).map(mapDbToSolve);
}

export async function getLatestSolveForProblem(
  supabase: SupabaseClient,
  problemId: string
): Promise<Solve | null> {
  const { data, error } = await supabase
    .from('solves')
    .select('*')
    .eq('problem_id', problemId)
    .order('solved_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapDbToSolve(data as DbSolve);
}

export async function recordSolve(
  supabase: SupabaseClient,
  dto: CreateSolveDTO
): Promise<Solve> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Get the previous solve to calculate SM-2 values
  const previousSolve = await getLatestSolveForProblem(supabase, dto.problemId);

  // Calculate SM-2 values
  const sm2Result = calculateSM2FromDifficulty(
    dto.personalDifficulty,
    previousSolve?.easinessFactor ?? 2.5,
    previousSolve?.interval ?? 0,
    previousSolve?.repetition ?? 0
  );

  const { data, error } = await supabase
    .from('solves')
    .insert({
      problem_id: dto.problemId,
      user_id: user.id,
      solved_at: (dto.solvedAt ?? new Date()).toISOString(),
      personal_difficulty: dto.personalDifficulty,
      time_complexity: dto.timeComplexity,
      space_complexity: dto.spaceComplexity,
      pseudocode: dto.pseudocode,
      notes: dto.notes,
      easiness_factor: sm2Result.easinessFactor,
      interval: sm2Result.interval,
      repetition: sm2Result.repetition,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbToSolve(data as DbSolve);
}

export async function deleteSolve(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from('solves').delete().eq('id', id);

  if (error) throw error;
}

export async function getAllUserSolves(
  supabase: SupabaseClient
): Promise<Solve[]> {
  const { data, error } = await supabase
    .from('solves')
    .select('*')
    .order('solved_at', { ascending: false });

  if (error) throw error;
  return (data as DbSolve[]).map(mapDbToSolve);
}

export interface DifficultyStats {
  count: number;
  percentChange: number | null; // null when no solves last week (can't calculate percentage)
}

export interface SolveStatsByDifficulty {
  easy: DifficultyStats;
  medium: DifficultyStats;
  hard: DifficultyStats;
}

export async function getSolveStatsByDifficulty(
  supabase: SupabaseClient
): Promise<SolveStatsByDifficulty> {
  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - 7);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  // Fetch all solves with their problem's leetcode_difficulty
  const { data, error } = await supabase
    .from('solves')
    .select(`
      solved_at,
      problems!inner (
        leetcode_difficulty
      )
    `)
    .gte('solved_at', startOfLastWeek.toISOString());

  if (error) throw error;

  // Count solves by difficulty and time period
  const thisWeekCounts = { easy: 0, medium: 0, hard: 0 };
  const lastWeekCounts = { easy: 0, medium: 0, hard: 0 };

  for (const solve of data || []) {
    const solvedAt = new Date(solve.solved_at);
    // Supabase returns the joined table - extract leetcode_difficulty
    const problemData = solve.problems as unknown as { leetcode_difficulty: string };
    const difficulty = problemData.leetcode_difficulty as 'easy' | 'medium' | 'hard';

    if (solvedAt >= startOfThisWeek) {
      thisWeekCounts[difficulty]++;
    } else {
      lastWeekCounts[difficulty]++;
    }
  }

  // Calculate percentage changes
  const calculatePercentChange = (thisWeek: number, lastWeek: number): number | null => {
    if (lastWeek === 0) {
      return thisWeek > 0 ? null : null; // Can't calculate percentage from 0
    }
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  };

  return {
    easy: {
      count: thisWeekCounts.easy,
      percentChange: calculatePercentChange(thisWeekCounts.easy, lastWeekCounts.easy),
    },
    medium: {
      count: thisWeekCounts.medium,
      percentChange: calculatePercentChange(thisWeekCounts.medium, lastWeekCounts.medium),
    },
    hard: {
      count: thisWeekCounts.hard,
      percentChange: calculatePercentChange(thisWeekCounts.hard, lastWeekCounts.hard),
    },
  };
}
