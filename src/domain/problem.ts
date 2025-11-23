import { Url } from "url";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface Problem {
    id: number;
    title: string;
    url: string;
    difficulty: Difficulty;
    topics: string[];
}