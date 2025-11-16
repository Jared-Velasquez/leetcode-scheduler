import type Database from "@tauri-apps/plugin-sql";

type Migration = {
    id: number;
    name: string;
    sql: string;
}
const MIGRATIONS: Migration[] = [
    {
        id: 1,
        name: "create_question_and_attempt",
        sql: `
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id   INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS question (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        slug            TEXT NOT NULL UNIQUE,
        title           TEXT NOT NULL,
        difficulty      TEXT NOT NULL CHECK (difficulty IN ('EASY','MEDIUM','HARD')),
        url             TEXT,
        topics          TEXT,
        is_favorited    INTEGER NOT NULL DEFAULT 0,
        last_attempt_at TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS attempt (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id     INTEGER NOT NULL REFERENCES question(id) ON DELETE CASCADE,
        attempt_number  INTEGER NOT NULL,
        status          TEXT NOT NULL CHECK (
                          status IN ('PASSED','FAILED','PARTIAL','SKIPPED')
                        ),
        language        TEXT,
        time_ms         INTEGER,
        memory_kb       INTEGER,
        source_code     TEXT,
        notes           TEXT,
        created_at      TEXT NOT NULL DEFAULT (datetime('now')),
        UNIQUE(question_id, attempt_number)
      );

      CREATE INDEX IF NOT EXISTS idx_attempt_question_created_at
        ON attempt(question_id, created_at DESC);
    `,
    },

    // TODO: add future migrations here
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