import { LeetcodeDifficulty } from './enums';
import { Solve } from './solve';

export interface Problem {
  id: string;
  userId: string;
  leetcodeNumber: number;
  title: string;
  url?: string;
  leetcodeDifficulty: LeetcodeDifficulty;
  patternId: string;
  subpatternId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProblemDTO {
  leetcodeNumber: number;
  title: string;
  url?: string;
  leetcodeDifficulty: LeetcodeDifficulty;
  patternId: string;
  subpatternId?: string;
  notes?: string;
}

export interface UpdateProblemDTO extends Partial<CreateProblemDTO> {}

export interface ProblemWithSolves extends Problem {
  solves: Solve[];
  nextReviewDate?: Date;
  isOverdue: boolean;
}

export interface ProblemFilters {
  patternId?: string;
  subpatternId?: string;
  leetcodeDifficulty?: LeetcodeDifficulty;
  search?: string;
}
