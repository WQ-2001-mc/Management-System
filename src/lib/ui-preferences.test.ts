import { describe, expect, it } from "vitest";

import { parseCollapsedPreference, parseThemePreference } from "./ui-preferences";

describe("UI preferences", () => {
  it("accepts known theme values only", () => {
    expect(parseThemePreference("dark")).toBe("dark");
    expect(parseThemePreference("system")).toBeNull();
  });

  it("parses persisted sidebar state without coercing invalid values", () => {
    expect(parseCollapsedPreference("true")).toBe(true);
    expect(parseCollapsedPreference("false")).toBe(false);
    expect(parseCollapsedPreference(null)).toBeNull();
  });
});

