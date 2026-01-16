'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Solve, CreateSolveDTO } from '@/types';
import {
  getSolvesForProblem,
  recordSolve,
  deleteSolve,
} from '@/services/solves.service';

export function useSolves(problemId: string) {
  const [solves, setSolves] = useState<Solve[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchSolves = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSolvesForProblem(supabase, problemId);
      setSolves(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch solves'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, problemId]);

  useEffect(() => {
    if (problemId) {
      fetchSolves();
    }
  }, [fetchSolves, problemId]);

  const record = useCallback(
    async (dto: Omit<CreateSolveDTO, 'problemId'>) => {
      const newSolve = await recordSolve(supabase, {
        ...dto,
        problemId,
      });
      setSolves((prev) => [newSolve, ...prev]);
      return newSolve;
    },
    [supabase, problemId]
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteSolve(supabase, id);
      setSolves((prev) => prev.filter((s) => s.id !== id));
    },
    [supabase]
  );

  const latestSolve = solves[0] ?? null;

  return {
    solves,
    latestSolve,
    isLoading,
    error,
    refetch: fetchSolves,
    recordSolve: record,
    deleteSolve: remove,
  };
}
