import { Difficulty, Problem } from "@/domain/problem";


export interface ProblemEntity {
    id: number;
    title: string;
    difficulty: Difficulty;
    url: string;
    created_at: string;
    updated_at: string;
}

export function mapProblemEntityToDomain(entity: ProblemEntity): Problem {
    return {
        id: entity.id,
        title: entity.title,
        difficulty: entity.difficulty,
        url: entity.url,
        topics: [], // TODO: map topics when available
    };
}

export function mapProblemDomainToEntity(domain: Problem): ProblemEntity {
    return {
        id: domain.id,
        title: domain.title,
        difficulty: domain.difficulty,
        url: domain.url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}