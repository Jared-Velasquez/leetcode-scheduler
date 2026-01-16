import { ProblemWithSolves } from './problem';
import { Solve } from './solve';

export interface QueueItem {
  problem: ProblemWithSolves;
  nextReviewDate: Date;
  daysUntilDue: number;
  isOverdue: boolean;
  lastSolve?: Solve;
}

export interface QueueFilters {
  showOverdue: boolean;
  showUpcoming: boolean;
  daysAhead?: number;
}

export interface QueueStats {
  overdueCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
  totalProblems: number;
}
