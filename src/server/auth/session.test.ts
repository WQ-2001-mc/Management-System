import { describe, expect, it } from "vitest";

import { createSessionToken, verifySessionToken } from "./session";

describe("signed session token", () => {
  it("round-trips an authenticated user", () => {
    const token = createSessionToken({ email: "admin@nexus.local", role: "超级管理员" }, "test-secret");
    expect(verifySessionToken(token, "test-secret")).toEqual({
      email: "admin@nexus.local",
      role: "超级管理员",
    });
  });

  it("rejects a tampered token", () => {
    const token = createSessionToken({ email: "admin@nexus.local", role: "超级管理员" }, "test-secret");
    expect(verifySessionToken(`${token}x`, "test-secret")).toBeNull();
  });
});
