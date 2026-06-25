import path from "node:path";
import { describe, expect, it } from "vitest";

import { resolveSqlitePath } from "./ensure-sqlite";

describe("resolveSqlitePath", () => {
  it("resolves Prisma relative SQLite paths from the schema directory", () => {
    expect(resolveSqlitePath("file:./dev.db", "/workspace")).toBe(
      path.join("/workspace", "prisma", "dev.db"),
    );
  });

  it("preserves absolute SQLite paths", () => {
    expect(resolveSqlitePath("file:/data/nexus.db", "/workspace")).toBe("/data/nexus.db");
  });
});
