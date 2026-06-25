import { createHash } from "node:crypto";

import { PrismaClient } from "@prisma/client";

import { approvals, contracts, customers, departments, projects } from "../src/lib/demo-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.tenant.deleteMany();
  const tenant = await prisma.tenant.create({
    data: { name: "启衡科技（上海）有限公司", code: "NEXUS-SH-001" },
  });

  const createdDepartments = await Promise.all(
    departments.map((item) =>
      prisma.department.create({
        data: { tenantId: tenant.id, name: item.name, lead: item.lead },
      }),
    ),
  );

  await prisma.user.createMany({
    data: [
      { tenantId: tenant.id, departmentId: createdDepartments[0].id, name: "李明远", email: "admin@nexus.local", passwordHash: createHash("sha256").update("Nexus@2026").digest("hex"), title: "产品总监", role: "SUPER_ADMIN" },
      { tenantId: tenant.id, departmentId: createdDepartments[0].id, name: "张磊", email: "manager@nexus.local", passwordHash: createHash("sha256").update("Manager@2026").digest("hex"), title: "高级项目经理", role: "MANAGER" },
    ],
  });

  const customerIds = new Map<string, string>();
  for (const item of customers) {
    const customer = await prisma.customer.create({
      data: {
        tenantId: tenant.id,
        code: item.id,
        name: item.name,
        industry: item.industry,
        region: item.region,
        level: item.level,
        owner: item.owner,
        contact: item.contact,
        phone: item.phone,
        value: item.value,
        status: item.status,
      },
    });
    customerIds.set(item.name, customer.id);
  }

  const projectIds = new Map<string, string>();
  for (const item of projects) {
    const project = await prisma.project.create({
      data: {
        tenantId: tenant.id,
        customerId: customerIds.get(item.customer),
        code: item.id,
        name: item.name,
        owner: item.owner,
        budget: item.budget,
        progress: item.progress,
        status: item.status,
        deadline: new Date(item.deadline),
        members: item.members,
      },
    });
    projectIds.set(item.name, project.id);
  }

  for (const item of contracts) {
    await prisma.contract.create({
      data: {
        tenantId: tenant.id,
        customerId: customerIds.get(item.customer),
        projectId: projectIds.get(projects.find((project) => project.customer === item.customer)?.name ?? ""),
        number: item.number,
        name: item.name,
        owner: item.owner,
        amount: item.amount,
        collected: item.collected,
        status: item.status,
        signedAt: item.signedAt === "-" ? null : new Date(item.signedAt),
        expiresAt: new Date(item.expiresAt),
      },
    });
  }

  await prisma.approvalRequest.createMany({
    data: approvals.map((item) => ({
      tenantId: tenant.id,
      code: item.id,
      title: item.title,
      type: item.type,
      applicant: item.applicant,
      amount: item.amount,
      status: item.status,
      currentStep: item.step,
    })),
  });

  await prisma.systemSetting.createMany({
    data: [
      { tenantId: tenant.id, key: "timezone", value: "Asia/Shanghai" },
      { tenantId: tenant.id, key: "theme", value: "light" },
    ],
  });

  console.log(`Seeded tenant ${tenant.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

