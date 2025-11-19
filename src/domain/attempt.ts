export type Language = "PYTHON" | "JAVA" | "JAVASCRIPT" | "CPP";

export interface SuccessfulAttempt {
    id: number;
    problemId: number;
    createdAt: Date;
    language?: Language;
    sourceCode?: string; // Language must be specified if sourceCode is provided
    notes?: string;
}