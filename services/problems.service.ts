import { SupabaseClient } from '@supabase/supabase-js';
import {
  Problem,
  CreateProblemDTO,
  UpdateProblemDTO,
  ProblemFilters,
  ProblemWithSolves,
} from '@/types';

interface DbProblem {
  id: string;
  user_id: string;
  leetcode_number: number;
  title: string;
  url: string | null;
  leetcode_difficulty: string;
  pattern_id: string;
  subpattern_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function mapDbToProblem(db: DbProblem): Problem {
  return {
    id: db.id,
    userId: db.user_id,
    leetcodeNumber: db.leetcode_number,
    title: db.title,
    url: db.url ?? undefined,
    leetcodeDifficulty: db.leetcode_difficulty as Problem['leetcodeDifficulty'],
    patternId: db.pattern_id,
    subpatternId: db.subpattern_id ?? undefined,
    notes: db.notes ?? undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  };
}

export async function getProblems(
  supabase: SupabaseClient,
  filters?: ProblemFilters
): Promise<Problem[]> {
  let query = supabase.from('problems').select('*');

  if (filters?.patternId) {
    query = query.eq('pattern_id', filters.patternId);
  }

  if (filters?.subpatternId) {
    query = query.eq('subpattern_id', filters.subpatternId);
  }

  if (filters?.leetcodeDifficulty) {
    query = query.eq('leetcode_difficulty', filters.leetcodeDifficulty);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,leetcode_number.eq.${
        parseInt(filters.search) || 0
      }`
    );
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return (data as DbProblem[]).map(mapDbToProblem);
}

export async function getProblemById(
  supabase: SupabaseClient,
  id: string
): Promise<Problem | null> {
  const { data, error } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return mapDbToProblem(data as DbProblem);
}

export async function getProblemWithSolves(
  supabase: SupabaseClient,
  id: string
): Promise<ProblemWithSolves | null> {
  const { data, error } = await supabase
    .from('problems')
    .select(
      `
      *,
      solves (*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  const problem = mapDbToProblem(data as DbProblem);
  const solves = (data.solves || []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    problemId: s.problem_id as string,
    userId: s.user_id as string,
    solvedAt: new Date(s.solved_at as string),
    personalDifficulty: s.personal_difficulty as number,
    timeComplexity: s.time_complexity as string,
    spaceComplexity: s.space_complexity as string,
    pseudocode: (s.pseudocode as string) ?? undefined,
    notes: (s.notes as string) ?? undefined,
    easinessFactor: s.easiness_factor as number,
    interval: s.interval as number,
    repetition: s.repetition as number,
    createdAt: new Date(s.created_at as string),
  }));

  // Calculate next review date from latest solve
  const latestSolve = solves.sort(
    (a: { solvedAt: Date }, b: { solvedAt: Date }) =>
      b.solvedAt.getTime() - a.solvedAt.getTime()
  )[0];

  let nextReviewDate: Date | undefined;
  let isOverdue = false;

  if (latestSolve) {
    const reviewDate = new Date(latestSolve.solvedAt);
    reviewDate.setDate(reviewDate.getDate() + latestSolve.interval);
    nextReviewDate = reviewDate;
    isOverdue = reviewDate < new Date();
  }

  return {
    ...problem,
    solves,
    nextReviewDate,
    isOverdue,
  };
}

export async function createProblem(
  supabase: SupabaseClient,
  dto: CreateProblemDTO
): Promise<Problem> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('problems')
    .insert({
      user_id: user.id,
      leetcode_number: dto.leetcodeNumber,
      title: dto.title,
      url: dto.url,
      leetcode_difficulty: dto.leetcodeDifficulty,
      pattern_id: dto.patternId,
      subpattern_id: dto.subpatternId,
      notes: dto.notes,
    })
    .select()
    .single();

  if (error) throw error;
  return mapDbToProblem(data as DbProblem);
}

export async function updateProblem(
  supabase: SupabaseClient,
  id: string,
  dto: UpdateProblemDTO
): Promise<Problem> {
  const updateData: Record<string, unknown> = {};

  if (dto.leetcodeNumber !== undefined)
    updateData.leetcode_number = dto.leetcodeNumber;
  if (dto.title !== undefined) updateData.title = dto.title;
  if (dto.url !== undefined) updateData.url = dto.url;
  if (dto.leetcodeDifficulty !== undefined)
    updateData.leetcode_difficulty = dto.leetcodeDifficulty;
  if (dto.patternId !== undefined) updateData.pattern_id = dto.patternId;
  if (dto.subpatternId !== undefined)
    updateData.subpattern_id = dto.subpatternId;
  if (dto.notes !== undefined) updateData.notes = dto.notes;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('problems')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapDbToProblem(data as DbProblem);
}

export async function deleteProblem(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from('problems').delete().eq('id', id);

  if (error) throw error;
}
