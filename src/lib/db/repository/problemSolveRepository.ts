import { Language, ProblemSolve } from "@/domain/problemSolve";

export interface ProblemSolveEntity {
    id: number;
    problem_id: number;
    created_at: string;
    time_complexity: string;
    space_complexity: string;
    language?: string;
    source_code?: string;
    notes?: string;
}

export function mapProblemSolveEntityToDomain(entity: ProblemSolveEntity): ProblemSolve {
    return {
        id: entity.id,
        problemId: entity.problem_id,
        createdAt: new Date(entity.created_at),
        timeComplexity: entity.time_complexity,
        spaceComplexity: entity.space_complexity,
        language: entity.language as Language,
        sourceCode: entity.source_code,
        notes: entity.notes,
    } as ProblemSolve;
}

export function mapProblemSolveDomainToEntity(domain: ProblemSolve): ProblemSolveEntity {
    return {
        id: domain.id,
        problem_id: domain.problemId,
        created_at: domain.createdAt.toISOString(),
        time_complexity: domain.timeComplexity,
        space_complexity: domain.spaceComplexity,
        language: domain.language,
        source_code: domain.sourceCode,
        notes: domain.notes,
    } as ProblemSolveEntity;
}