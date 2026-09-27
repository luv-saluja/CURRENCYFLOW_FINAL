import initSqlJs, { type Database } from "sql.js";
import type { ConversionRecord } from "../types/currency";
import { LOCAL_STORAGE_KEYS } from "../utils/constants";

/**
 * Recent conversions are stored in a real SQLite database running in the
 * browser via sql.js (SQLite compiled to WebAssembly). The database bytes
 * are serialized into localStorage after every write, so history survives
 * reloads without needing any backend.
 */

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS recent_conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_currency TEXT NOT NULL,
    to_currency TEXT NOT NULL,
    amount REAL NOT NULL,
    converted REAL NOT NULL,
    rate REAL NOT NULL,
    created_at TEXT NOT NULL
  );
`;

let dbPromise: Promise<Database> | null = null;

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function persist(db: Database) {
  try {
    const bytes = db.export();
    localStorage.setItem(LOCAL_STORAGE_KEYS.sqliteDb, uint8ArrayToBase64(bytes));
  } catch {
    // Persistence is best-effort; a full localStorage quota shouldn't crash
    // the app, it just means history won't survive a reload this time.
  }
}

async function createDatabase(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => `https://sql.js.org/dist/${file}`,
  });

  const existing = localStorage.getItem(LOCAL_STORAGE_KEYS.sqliteDb);
  const db = existing ? new SQL.Database(base64ToUint8Array(existing)) : new SQL.Database();
  db.run(SCHEMA);
  return db;
}

function getDb(): Promise<Database> {
  if (!dbPromise) dbPromise = createDatabase();
  return dbPromise;
}

export async function addConversion(
  record: Omit<ConversionRecord, "id">
): Promise<void> {
  const db = await getDb();
  db.run(
    `INSERT INTO recent_conversions (from_currency, to_currency, amount, converted, rate, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      record.fromCurrency,
      record.toCurrency,
      record.amount,
      record.converted,
      record.rate,
      record.createdAt,
    ]
  );
  // Keep only the most recent 50 rows so the table (and localStorage blob)
  // stay small.
  db.run(
    `DELETE FROM recent_conversions WHERE id NOT IN (
       SELECT id FROM recent_conversions ORDER BY id DESC LIMIT 50
     )`
  );
  persist(db);
}

export async function getRecentConversions(limit = 8): Promise<ConversionRecord[]> {
  const db = await getDb();
  const stmt = db.prepare(
    `SELECT id, from_currency AS fromCurrency, to_currency AS toCurrency, amount, converted, rate, created_at AS createdAt
     FROM recent_conversions ORDER BY id DESC LIMIT ?`
  );
  stmt.bind([limit]);
  const rows: ConversionRecord[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as ConversionRecord);
  }
  stmt.free();
  return rows;
}

export async function clearRecentConversions(): Promise<void> {
  const db = await getDb();
  db.run(`DELETE FROM recent_conversions;`);
  persist(db);
}
