'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { recordSolve } from '@/services/solves.service';
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
