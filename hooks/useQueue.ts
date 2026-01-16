'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { QueueItem, QueueFilters, QueueStats } from '@/types';
import { getQueueItems, getQueueStats } from '@/services/queue.service';

export function useQueue(filters?: QueueFilters) {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState<QueueStats>({
    overdueCount: 0,
    dueTodayCount: 0,
    dueThisWeekCount: 0,
    totalProblems: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [queueItems, queueStats] = await Promise.all([
        getQueueItems(supabase, filters),
        getQueueStats(supabase),
      ]);
      setItems(queueItems);
      setStats(queueStats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch queue'));
    } finally {
      setIsLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const overdueItems = items.filter((item) => item.isOverdue);
  const upcomingItems = items.filter((item) => !item.isOverdue);

  return {
    items,
    overdueItems,
    upcomingItems,
    stats,
    isLoading,
    error,
    refetch: fetchQueue,
  };
}
