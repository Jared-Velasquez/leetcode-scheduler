import type Database from "@tauri-apps/plugin-sql";

type Migration = {
    id: number;
    name: string;
    sql: string;
}
const MIGRATIONS: Migration[] = [
    {
        id: 1,
        name: "create_question_and_problem_solve",
        sql: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id   INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS problems (
        id              INTEGER PRIMARY KEY,
        title           TEXT NOT NULL,
        difficulty      TEXT NOT NULL CHECK (difficulty IN ('EASY','MEDIUM','HARD')),
        url             TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS problem_solves (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id     INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        solve_number  INTEGER NOT NULL,
        language        TEXT,
        source_code     TEXT,
        notes           TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(problem_id, solve_number)
      );

      CREATE TABLE IF NOT EXISTS topics (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
        topic       TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_problem_solve_problem_created_at
        ON problem_solves(problem_id, created_at DESC);
    `,
    }
];

export async function runMigrations(db: Database): Promise<void> {
    // Ensure schema_migrations table exists
    await db.execute(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id   INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );
    `);

    // Find which migrations are already applied
    const appliedRows = await db.select<{ id: number }[]>(
        `SELECT id FROM schema_migrations ORDER BY id ASC;`
    );
    const appliedIds = new Set(appliedRows.map((r) => r.id));

    for (const m of MIGRATIONS) {
        if (appliedIds.has(m.id)) continue;

        // Apply migration in a transaction
        await db.execute("BEGIN");
        try {
            await db.execute(m.sql);
            await db.execute(
                `INSERT INTO schema_migrations (id, name) VALUES (?, ?);`,
                [m.id, m.name]
            );
            await db.execute("COMMIT");
        } catch (e) {
            await db.execute("ROLLBACK");
            console.error("Failed to apply migration:", m.name, e);
            throw e;
        }
    }
}