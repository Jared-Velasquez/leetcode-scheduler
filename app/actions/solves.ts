'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { recordSolve, getSolvesForProblem } from '@/services/solves.service';
import { CreateSolveDTO } from '@/types';

export async function recordSolveAction(dto: CreateSolveDTO) {
  const supabase = await createClient();

  try {
    const solve = await recordSolve(supabase, dto);
    revalidatePath('/problems');
    revalidatePath('/dashboard');
    return { success: true, data: solve };
  } catch (error) {
    console.error('Failed to record solve:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record attempt',
    };
  }
}

export async function getSolvesForProblemAction(problemId: string) {
  const supabase = await createClient();

  try {
    const solves = await getSolvesForProblem(supabase, problemId);
    return {
      success: true,
      data: solves.map((s) => ({
        ...s,
        solvedAt: s.solvedAt.toISOString(),
        createdAt: s.createdAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Failed to fetch solves:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch solves',
    };
  }
}
