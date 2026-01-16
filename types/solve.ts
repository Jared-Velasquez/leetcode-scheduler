import { PersonalDifficulty } from './enums';

export interface Solve {
  id: string;
  problemId: string;
  userId: string;
  solvedAt: Date;
  personalDifficulty: PersonalDifficulty;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode?: string;
  notes?: string;
  easinessFactor: number;
  interval: number;
  repetition: number;
  createdAt: Date;
}

export interface CreateSolveDTO {
  problemId: string;
  solvedAt?: Date;
  personalDifficulty: PersonalDifficulty;
  timeComplexity: string;
  spaceComplexity: string;
  pseudocode?: string;
  notes?: string;
}

export interface SM2Result {
  easinessFactor: number;
  interval: number;
  repetition: number;
  nextReviewDate: Date;
}
