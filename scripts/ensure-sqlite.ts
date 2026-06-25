import "dotenv/config";

import { mkdir, open } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export function resolveSqlitePath(databaseUrl: string, cwd: string) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error("DATABASE_URL must use the file: protocol for the default SQLite setup");
  }
  const rawPath = databaseUrl.slice("file:".length).split("?")[0];
  return path.isAbsolute(rawPath)
    ? rawPath
    : path.resolve(cwd, "prisma", rawPath);
}

async function ensureSqlite() {
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const databasePath = resolveSqlitePath(databaseUrl, process.cwd());
  await mkdir(path.dirname(databasePath), { recursive: true });
  const handle = await open(databasePath, "a");
  await handle.close();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  ensureSqlite().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

