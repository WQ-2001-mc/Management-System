import { describe, expect, it } from "vitest";

import { validateDemoLogin } from "./demo-session";

describe("validateDemoLogin", () => {
  it("accepts the documented administrator account", () => {
    expect(validateDemoLogin("admin@nexus.local", "Nexus@2026")?.role).toBe("超级管理员");
  });

  it("rejects invalid credentials", () => {
    expect(validateDemoLogin("admin@nexus.local", "wrong")).toBeNull();
  });
});
