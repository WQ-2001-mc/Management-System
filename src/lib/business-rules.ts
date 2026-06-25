export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalAction = "APPROVE" | "REJECT";

export function can(permissions: readonly string[], permission: string) {
  return permissions.includes("*") || permissions.includes(permission);
}

export function calculateCollectionRate(contracted: number, collected: number) {
  if (contracted <= 0) return 0;
  return Number(((collected / contracted) * 100).toFixed(2));
}

export function contractBalance(amount: number, collected: number) {
  return Math.max(0, amount - collected);
}

export function projectProgress(values: readonly number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function nextApprovalStatus(
  current: ApprovalStatus,
  action: ApprovalAction,
  isFinalStep: boolean,
): ApprovalStatus {
  if (current !== "PENDING") return current;
  if (action === "REJECT") return "REJECTED";
  return isFinalStep ? "APPROVED" : "PENDING";
}

