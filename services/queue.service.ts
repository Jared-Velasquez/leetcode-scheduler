import { SupabaseClient } from '@supabase/supabase-js';
import {
  QueueItem,
  QueueFilters,
  QueueStats,
  ProblemWithSolves,
  Solve,
} from '@/types';
import { daysBetween, isToday, isWithinDays } from '@/lib/utils/date';

interface DbProblemWithSolves {
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
  solves: DbSolve[];
}

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
    personalDifficulty: db.personal_difficulty as Solve['personalDifficulty'],
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

function calculateNextReviewDate(latestSolve: Solve): Date {
  const reviewDate = new Date(latestSolve.solvedAt);
  reviewDate.setDate(reviewDate.getDate() + latestSolve.interval);
  return reviewDate;
}

function mapDbToProblemWithSolves(db: DbProblemWithSolves): ProblemWithSolves {
  const solves = (db.solves || []).map(mapDbToSolve);

  // Sort solves by date descending
  solves.sort((a, b) => b.solvedAt.getTime() - a.solvedAt.getTime());

  const latestSolve = solves[0];
  let nextReviewDate: Date | undefined;
  let isOverdue = false;

  if (latestSolve) {
    nextReviewDate = calculateNextReviewDate(latestSolve);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewDateNormalized = new Date(nextReviewDate);
    reviewDateNormalized.setHours(0, 0, 0, 0);
    isOverdue = reviewDateNormalized < today;
  }

  return {
    id: db.id,
    userId: db.user_id,
    leetcodeNumber: db.leetcode_number,
    title: db.title,
    url: db.url ?? undefined,
    leetcodeDifficulty:
      db.leetcode_difficulty as ProblemWithSolves['leetcodeDifficulty'],
    patternId: db.pattern_id,
    subpatternId: db.subpattern_id ?? undefined,
    notes: db.notes ?? undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
    solves,
    nextReviewDate,
    isOverdue,
  };
}

export async function getQueueItems(
  supabase: SupabaseClient,
  filters?: QueueFilters
): Promise<QueueItem[]> {
  const { data, error } = await supabase.from('problems').select(`
      *,
      solves (*)
    `);

  if (error) throw error;

  const problemsWithSolves = (data as DbProblemWithSolves[]).map(
    mapDbToProblemWithSolves
  );

  // Only include problems that have been solved at least once
  const solvedProblems = problemsWithSolves.filter(
    (p) => p.solves.length > 0 && p.nextReviewDate
  );

  const today = new Date();

  let queueItems: QueueItem[] = solvedProblems.map((problem) => {
    const latestSolve = problem.solves[0];
    const nextReviewDate = problem.nextReviewDate!;
    const daysUntilDue = daysBetween(today, nextReviewDate);

    return {
      problem,
      nextReviewDate,
      daysUntilDue,
      isOverdue: problem.isOverdue,
      lastSolve: latestSolve,
    };
  });

  // Apply filters
  if (filters) {
    if (filters.showOverdue && !filters.showUpcoming) {
      queueItems = queueItems.filter((item) => item.isOverdue);
    } else if (filters.showUpcoming && !filters.showOverdue) {
      queueItems = queueItems.filter((item) => !item.isOverdue);
    }

    if (filters.daysAhead !== undefined) {
      queueItems = queueItems.filter(
        (item) =>
          item.isOverdue ||
          isWithinDays(item.nextReviewDate, filters.daysAhead!)
      );
    }
  }

  // Sort: overdue first (most overdue at top), then upcoming by nearest date
  queueItems.sort((a, b) => {
    // Both overdue: most overdue first (larger negative number first)
    if (a.isOverdue && b.isOverdue) {
      return a.daysUntilDue - b.daysUntilDue;
    }
    // Only a is overdue
    if (a.isOverdue) return -1;
    // Only b is overdue
    if (b.isOverdue) return 1;
    // Neither overdue: nearest date first
    return a.daysUntilDue - b.daysUntilDue;
  });

  return queueItems;
}

export async function getQueueStats(
  supabase: SupabaseClient
): Promise<QueueStats> {
  const queueItems = await getQueueItems(supabase);
  const today = new Date();

  return {
    overdueCount: queueItems.filter((item) => item.isOverdue).length,
    dueTodayCount: queueItems.filter((item) => isToday(item.nextReviewDate))
      .length,
    dueThisWeekCount: queueItems.filter(
      (item) => !item.isOverdue && isWithinDays(item.nextReviewDate, 7)
    ).length,
    totalProblems: queueItems.length,
  };
}

export async function getOverdueItems(
  supabase: SupabaseClient
): Promise<QueueItem[]> {
  return getQueueItems(supabase, { showOverdue: true, showUpcoming: false });
}

export async function getUpcomingItems(
  supabase: SupabaseClient,
  daysAhead: number = 7
): Promise<QueueItem[]> {
  return getQueueItems(supabase, {
    showOverdue: false,
    showUpcoming: true,
    daysAhead,
  });
}
