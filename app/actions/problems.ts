'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  createProblem,
  updateProblem,
  deleteProblem,
} from '@/services/problems.service';
import { CreateProblemDTO, UpdateProblemDTO } from '@/types';

export async function createProblemAction(dto: CreateProblemDTO) {
  const supabase = await createClient();

  try {
    const problem = await createProblem(supabase, dto);
    revalidatePath('/problems');
    revalidatePath('/dashboard');
    return { success: true, data: problem };
  } catch (error) {
    console.error('Failed to create problem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create problem',
    };
  }
}

export async function updateProblemAction(id: string, dto: UpdateProblemDTO) {
  const supabase = await createClient();

  try {
    const problem = await updateProblem(supabase, id, dto);
    revalidatePath('/problems');
    revalidatePath('/dashboard');
    return { success: true, data: problem };
  } catch (error) {
    console.error('Failed to update problem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update problem',
    };
  }
}

export async function deleteProblemAction(id: string) {
  const supabase = await createClient();

  try {
    await deleteProblem(supabase, id);
    revalidatePath('/problems');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete problem:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete problem',
    };
  }
}
