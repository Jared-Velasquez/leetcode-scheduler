'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Problem,
  CreateProblemDTO,
  UpdateProblemDTO,
  ProblemFilters,
} from '@/types';
import {
  getProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from '@/services/problems.service';

export function useProblems(filters?: ProblemFilters) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchProblems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProblems(supabase, filters);
      setProblems(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch problems'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  const create = useCallback(
    async (dto: CreateProblemDTO) => {
      const newProblem = await createProblem(supabase, dto);
      setProblems((prev) => [newProblem, ...prev]);
      return newProblem;
    },
    [supabase]
  );

  const update = useCallback(
    async (id: string, dto: UpdateProblemDTO) => {
      const updatedProblem = await updateProblem(supabase, id, dto);
      setProblems((prev) =>
        prev.map((p) => (p.id === id ? updatedProblem : p))
      );
      return updatedProblem;
    },
    [supabase]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteProblem(supabase, id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    },
    [supabase]
  );

  return {
    problems,
    isLoading,
    error,
    refetch: fetchProblems,
    create,
    update,
    delete: remove,
  };
}
