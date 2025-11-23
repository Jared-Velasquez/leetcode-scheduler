export type Language = "PYTHON" | "JAVA" | "JAVASCRIPT" | "CPP";

export interface ProblemSolve {
    id: number;
    problemId: number;
    createdAt: Date;
    timeComplexity: string;
    spaceComplexity: string;
    language?: Language;
    sourceCode?: string; // Language must be specified if sourceCode is provided
    notes?: string;
}