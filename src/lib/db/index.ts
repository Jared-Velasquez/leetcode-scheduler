import Database from "@tauri-apps/plugin-sql";
import { runMigrations } from "./migrations";

let dbPromise: Promise<Database> | null = null;

/**
 * Lazily load the database and run migrations exactly once.
 */
export function getDb(): Promise<Database> {
    if (!dbPromise) {
        dbPromise = (async () => {
            const db = await Database.load("sqlite:leetcode-scheduler.db");
            await runMigrations(db);
            return db;
        })();
    }
    return dbPromise;
}

export async function initDb(): Promise<void> {
    await getDb();
}