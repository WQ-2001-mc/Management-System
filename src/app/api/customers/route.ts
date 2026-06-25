import { NextResponse } from "next/server";

import { getCurrentSession } from "@/server/auth/current-session";
import { db } from "@/server/db/client";
import { customerInput } from "@/server/modules/customers/customer-schema";

const tenantCode = "NEXUS-SH-001";

export async function GET() {
  if (!(await getCurrentSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const tenant = await db.tenant.findUnique({ where: { code: tenantCode } });
  if (!tenant) return NextResponse.json({ data: [] });
  const data = await db.customer.findMany({
    where: { tenantId: tenant.id, deletedAt: null },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  if (!(await getCurrentSession())) return NextResponse.json({ error: "未登录" }, { status: 401 });
  const parsed = customerInput.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "客户数据校验失败", details: parsed.error.flatten() }, { status: 400 });
  }
  const tenant = await db.tenant.findUnique({ where: { code: tenantCode } });
  if (!tenant) return NextResponse.json({ error: "企业数据尚未初始化" }, { status: 409 });
  const count = await db.customer.count({ where: { tenantId: tenant.id } });
  const customer = await db.customer.create({
    data: {
      tenantId: tenant.id,
      code: `CUS-${String(count + 1).padStart(3, "0")}`,
      status: "重点跟进",
      ...parsed.data,
    },
  });
  await db.auditLog.create({
    data: { tenantId: tenant.id, actor: parsed.data.owner, action: "customer.create", entityType: "Customer", entityId: customer.id, detail: customer.name },
  });
  return NextResponse.json({ data: customer }, { status: 201 });
}
