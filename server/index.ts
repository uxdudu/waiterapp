import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import Database from "better-sqlite3";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.resolve(currentDirectory, "../data");
const databasePath = path.join(dataDirectory, "waiterapp.db");

fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Database(databasePath);
database.pragma("journal_mode = WAL");
database.exec(`
  CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  INSERT OR IGNORE INTO app_metadata (key, value)
  VALUES ('schema_version', '1');
`);

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  const databaseCheck = database.prepare("SELECT 1 AS ok").get() as { ok: number };

  response.json({
    status: databaseCheck.ok === 1 ? "ok" : "error",
    service: "waiterapp-api",
    database: "sqlite",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/meta", (_request, response) => {
  const metadata = database
    .prepare("SELECT key, value FROM app_metadata ORDER BY key")
    .all();

  response.json({ metadata });
});

app.use((_request, response) => {
  response.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Waiterapp API running on http://localhost:${port}`);
});
