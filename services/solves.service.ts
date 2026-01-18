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
