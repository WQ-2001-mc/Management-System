import { describe, expect, it } from "vitest";

import { appNavigation, searchNavigation } from "./app-navigation";

describe("searchNavigation", () => {
  it("returns all pages for an empty query", () => {
    expect(searchNavigation("  ")).toEqual(appNavigation);
  });

  it("matches Chinese labels and related keywords", () => {
    expect(searchNavigation("回款").map((item) => item.href)).toEqual(["/contracts"]);
    expect(searchNavigation("员工").map((item) => item.href)).toEqual(["/organization"]);
  });

  it("matches English keywords without case sensitivity", () => {
    expect(searchNavigation("CRM").map((item) => item.href)).toEqual(["/customers"]);
  });
});

