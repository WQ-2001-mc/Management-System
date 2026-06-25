export interface DemoUser {
  email: string;
  name: string;
  role: string;
  department: string;
}

const demoAccounts = [
  {
    email: "admin@nexus.local",
    password: "Nexus@2026",
    name: "李明远",
    role: "超级管理员",
    department: "产品交付部",
  },
  {
    email: "manager@nexus.local",
    password: "Manager@2026",
    name: "张磊",
    role: "部门负责人",
    department: "产品交付部",
  },
] as const;

export function validateDemoLogin(email: string, password: string): DemoUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const account = demoAccounts.find(
    (item) => item.email === normalizedEmail && item.password === password,
  );
  if (!account) return null;
  return {
    email: account.email,
    name: account.name,
    role: account.role,
    department: account.department,
  };
}

