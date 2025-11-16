export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
    id: number;
    title: string;
    difficulty: Difficulty;
    url: string | null;
    topics: string[];
    lastAttemptAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Attempt {
    id: number;
    problemId: number;
    timeComplexity: string;
    spaceComplexity: string;
    notes: string;
    createdAt: string;
}