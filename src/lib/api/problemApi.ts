import { Difficulty, Problem } from '@/domain/problem';
import { getDb } from '@/lib/db';
import { mapProblemEntityToDomain } from '@/lib/db/repository/problemRepository';

// TODO: add input validation checking with Zod
// TODO: add more robust exception handling (probably need to create custom exceptions)

export async function getProblem(problemId: number): Promise<Problem | null> {
  const db = await getDb();
  const rows = await db.select<any[]>('SELECT * FROM problems WHERE id = ?', [
    problemId,
  ]);
  if (!rows.length) return null;
  return mapProblemEntityToDomain(rows[0]);
}

export async function createProblem(input: Problem): Promise<Problem> {
  const db = await getDb();
  const now = new Date().toISOString();

  await db.execute(
    `INSERT INTO problems 
        (id, title, difficulty, url, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?)`,
    [input.id, input.title, input.difficulty, input.url, now, now],
  );
  const insertId = input.id;
  const createdProblem = await getProblem(insertId);
  if (!createdProblem) {
    throw new Error('Failed to retrieve created problem');
  }
  return createdProblem;
}

export type ProblemUpdateInput = {
  title?: string;
  url?: string;
  difficulty?: Difficulty;
};

export async function updateProblem(
  problemId: number,
  input: ProblemUpdateInput,
): Promise<Problem> {
  const db = await getDb();
  const now = new Date().toISOString();

  // Check if problem exists
  if (!(await getProblem(problemId))) {
    throw new Error(`Problem with id ${problemId} does not exist`);
  }

  // Build dynamic SQL query
  const fields: string[] = [];
  const values: any[] = [];

  if (input.title) {
    fields.push('title = ?');
    values.push(input.title);
  }
  if (input.url) {
    fields.push('url = ?');
    values.push(input.url);
  }
  if (input.difficulty) {
    fields.push('difficulty = ?');
    values.push(input.difficulty);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(problemId);

  const sql = `UPDATE problems SET ${fields.join(', ')} WHERE id = ?`;
  await db.execute(sql, values);

  const updatedProblem = await getProblem(problemId);
  if (!updatedProblem) {
    throw new Error(`Failed to retrieve updated problem with id ${problemId}`);
  }
  return updatedProblem;
}

export async function deleteProblem(id: number): Promise<void> {
  const db = await getDb();
  await db.execute('DELETE FROM problems WHERE id = ?', [id]);
}

export type ProblemSolveInput = {
  timeComplexity: string;
  spaceComplexity: string;
  language?: string;
  sourceCode?: string;
  notes?: string;
};

export async function markProblemSolved(
  problemId: number,
  input: ProblemSolveInput,
): Promise<void> {
  const db = await getDb();
  const now = new Date();
  const nowIso = now.toISOString();

  const rows = await db.select<any[]>(
    'SELECT solve_count FROM problems WHERE id = ?',
    [problemId],
  );

  if (!rows.length) throw new Error('Problem not found');

  const solveCount = rows[0].solve_count as number;
  const newSolveCount = solveCount + 1;

  // TODO: wrap executions in transaction

  // Insert solve record
  await db.execute(
    `INSERT INTO problem_solves 
        (problem_id, created_at, time_complexity, space_complexity, language, source_code, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      problemId,
      nowIso,
      input.timeComplexity,
      input.spaceComplexity,
      input.language || null,
      input.sourceCode || null,
      input.notes || null,
    ],
  );

  // Update solve count in problems table
  // TODO: update
  await db.execute('UPDATE problems SET solve_count = ? WHERE id = ?', [
    newSolveCount,
    problemId,
  ]);
}

export function computeNextIntervalDays(): number {
  return 1;
}
