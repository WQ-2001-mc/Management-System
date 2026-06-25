import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentSession } from "@/server/auth/current-session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return <AppShell>{children}</AppShell>;
}
