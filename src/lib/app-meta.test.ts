import { describe, expect, it } from "vitest";

import { appMeta } from "./app-meta";

describe("appMeta", () => {
  it("exposes the Chinese product identity", () => {
    expect(appMeta.name).toBe("NEXUS 企业数据平台");
    expect(appMeta.description).toContain("企业");
  });
});
