import { describe, expect, it } from "vitest";

import { customerInput } from "./customer-schema";

describe("customerInput", () => {
  it("rejects an empty customer name", () => {
    expect(customerInput.safeParse({ name: "", level: "A" }).success).toBe(false);
  });

  it("normalizes a valid customer", () => {
    const result = customerInput.parse({ name: " 华东医药集团 ", level: "A" });
    expect(result.name).toBe("华东医药集团");
  });
});
