import { describe, expect, it } from "vitest";

import {
  calculateCollectionRate,
  can,
  contractBalance,
  nextApprovalStatus,
  projectProgress,
} from "./business-rules";

describe("business rules", () => {
  it("checks exact and wildcard permissions", () => {
    expect(can(["customer.read"], "customer.read")).toBe(true);
    expect(can(["customer.read"], "customer.delete")).toBe(false);
    expect(can(["*"], "system.manage")).toBe(true);
  });

  it("calculates collection rate safely", () => {
    expect(calculateCollectionRate(2_450_000, 1_890_000)).toBe(77.14);
    expect(calculateCollectionRate(0, 0)).toBe(0);
  });

  it("calculates outstanding contract balance", () => {
    expect(contractBalance(1_200_000, 800_000)).toBe(400_000);
  });

  it("averages project progress", () => {
    expect(projectProgress([50, 100])).toBe(75);
    expect(projectProgress([])).toBe(0);
  });

  it("transitions sequential approvals", () => {
    expect(nextApprovalStatus("PENDING", "APPROVE", false)).toBe("PENDING");
    expect(nextApprovalStatus("PENDING", "APPROVE", true)).toBe("APPROVED");
    expect(nextApprovalStatus("PENDING", "REJECT", false)).toBe("REJECTED");
  });
});
