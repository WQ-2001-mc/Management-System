# NEXUS V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a polished, database-backed enterprise management system covering dashboards, organization, customers, projects, contracts, approvals, files, RBAC, audit logs, deployment, and automated tests.

**Architecture:** Use a Next.js modular monolith. Route handlers and server components call focused domain services; services own validation, authorization, transactions, and audit behavior; Prisma repositories own persistence. The default development database is SQLite so the project runs immediately, while the Prisma schema and Docker environment support PostgreSQL deployment.

**Tech Stack:** Next.js 15, React 19, TypeScript, Ant Design 5, ECharts, Prisma, Auth.js-compatible session utilities, Zod, Vitest, Testing Library, Playwright, Docker Compose, GitHub Actions.

---

## File Map

- `src/app/`: App Router pages, layouts, route handlers, loading and error states.
- `src/components/`: reusable shell, tables, charts, feedback and form components.
- `src/features/`: domain-facing UI definitions, columns and forms.
- `src/server/`: database, auth, RBAC, audit, storage and domain services.
- `src/lib/`: shared schemas, date/number formatting, constants and demo session helpers.
- `prisma/`: schema and realistic Chinese seed data.
- `tests/`: unit, component and end-to-end tests.
- `.github/workflows/ci.yml`: repeatable repository quality gate.

### Task 1: Project foundation and quality harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Create: `src/test/setup.ts`, `src/lib/app-meta.test.ts`, `src/lib/app-meta.ts`

- [ ] **Step 1: Write the failing metadata test**

```ts
import { describe, expect, it } from "vitest";
import { appMeta } from "./app-meta";

describe("appMeta", () => {
  it("exposes the Chinese product identity", () => {
    expect(appMeta.name).toBe("NEXUS 企业数据平台");
  });
});
```

- [ ] **Step 2: Run it and verify RED**

Run: `npm test -- src/lib/app-meta.test.ts`  
Expected: FAIL because `./app-meta` does not exist.

- [ ] **Step 3: Add the minimum foundation**

```ts
export const appMeta = {
  name: "NEXUS 企业数据平台",
  description: "面向成长型企业的一体化经营数据管理系统",
} as const;
```

Add scripts for `dev`, `build`, `lint`, `typecheck`, `test`, `test:coverage`, `test:e2e`, `db:push`, and `db:seed`. Configure `@/*` path aliases and jsdom tests.

- [ ] **Step 4: Verify GREEN and build**

Run: `npm test -- src/lib/app-meta.test.ts && npm run typecheck && npm run build`  
Expected: one passing test, zero type errors, successful Next.js build.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts src
git commit -m "chore: bootstrap nexus application"
```

### Task 2: Data model, seed data, RBAC and audit

**Files:**
- Create: `prisma/schema.prisma`, `prisma/seed.ts`
- Create: `src/server/db/client.ts`
- Create: `src/server/auth/permissions.ts`, `src/server/auth/permissions.test.ts`
- Create: `src/server/audit/audit-service.ts`, `src/server/audit/audit-service.test.ts`

- [ ] **Step 1: Write failing RBAC and audit tests**

```ts
expect(can({ permissions: ["customer.read"] }, "customer.read")).toBe(true);
expect(can({ permissions: ["customer.read"] }, "customer.delete")).toBe(false);
expect(buildAuditEntry({ action: "customer.create", entityId: "c1" }).action)
  .toBe("customer.create");
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/server/auth/permissions.test.ts src/server/audit/audit-service.test.ts`  
Expected: FAIL because permission and audit modules are missing.

- [ ] **Step 3: Implement schema and minimal services**

Define Tenant, Department, User, Role, Permission, Customer, Contact, Project, Milestone, Contract, PaymentPlan, PaymentRecord, FileAsset, ApprovalRequest, ApprovalStep, Notification, AuditLog and SystemSetting. Every business record includes `tenantId`, timestamps and soft deletion where appropriate.

```ts
export function can(
  actor: { permissions: readonly string[] },
  permission: string,
) {
  return actor.permissions.includes("*") || actor.permissions.includes(permission);
}
```

Seed one tenant, six users, departments, roles, customers, projects, contracts, approvals, notifications and dashboard history.

- [ ] **Step 4: Verify GREEN and database seed**

Run: `npm test -- src/server && npx prisma generate && npm run db:push && npm run db:seed`  
Expected: all server tests pass and seed exits zero.

- [ ] **Step 5: Commit**

```bash
git add prisma src/server
git commit -m "feat: add enterprise data model and authorization"
```

### Task 3: Application shell, responsive navigation and authentication

**Files:**
- Create: `src/components/app-shell/*`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(dashboard)/layout.tsx`
- Create: `src/lib/demo-session.ts`, `src/lib/demo-session.test.ts`

- [ ] **Step 1: Write failing session test**

```ts
expect(validateDemoLogin("admin@nexus.local", "Nexus@2026")?.role)
  .toBe("超级管理员");
expect(validateDemoLogin("admin@nexus.local", "wrong")).toBeNull();
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/lib/demo-session.test.ts`  
Expected: FAIL because the login helper is missing.

- [ ] **Step 3: Implement shell and login**

Build the dark graphite sidebar, top command bar, breadcrumbs, organization switcher, global search, quick-create menu, notifications, theme toggle and responsive drawer. Use signed HTTP-only demo sessions and server-side route guards.

- [ ] **Step 4: Verify GREEN and component rendering**

Run: `npm test -- src/lib/demo-session.test.ts src/components`  
Expected: login and shell tests pass without warnings.

- [ ] **Step 5: Commit**

```bash
git add src/app src/components src/lib
git commit -m "feat: add authenticated enterprise application shell"
```

### Task 4: Executive dashboard and global search

**Files:**
- Create: `src/server/modules/dashboard/dashboard-service.ts`
- Create: `src/server/modules/dashboard/dashboard-service.test.ts`
- Create: `src/features/dashboard/*`
- Create: `src/app/(dashboard)/dashboard/page.tsx`
- Create: `src/app/api/search/route.ts`

- [ ] **Step 1: Write failing KPI aggregation test**

```ts
expect(calculateCollectionRate({ contracted: 2450000, collected: 1890000 }))
  .toBe(77.14);
expect(calculateCollectionRate({ contracted: 0, collected: 0 })).toBe(0);
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/server/modules/dashboard/dashboard-service.test.ts`  
Expected: FAIL because dashboard calculations are missing.

- [ ] **Step 3: Implement dashboard**

Create KPI summaries, revenue/collection trend, target achievement, warnings, approvals, operations table, customer distribution, health indicators and activity feed. Build global search across customers, projects and contracts.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/server/modules/dashboard && npm run typecheck`  
Expected: tests and typecheck pass.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features/dashboard src/server/modules/dashboard
git commit -m "feat: build executive operations dashboard"
```

### Task 5: Organization and customer management

**Files:**
- Create: `src/server/modules/organization/*`, `src/server/modules/customers/*`
- Create: `src/features/organization/*`, `src/features/customers/*`
- Create: `src/app/(dashboard)/organization/page.tsx`
- Create: `src/app/(dashboard)/customers/page.tsx`
- Create: `src/app/api/customers/route.ts`

- [ ] **Step 1: Write failing customer validation test**

```ts
expect(customerInput.safeParse({ name: "", level: "A" }).success).toBe(false);
expect(customerInput.parse({ name: "华东医药集团", level: "A" }).name)
  .toBe("华东医药集团");
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/server/modules/customers`  
Expected: FAIL because customer schemas and services are missing.

- [ ] **Step 3: Implement management flows**

Add department tree, employee directory, role tags, customer list/detail drawer, contacts, follow-ups, search, filters, pagination, create/edit/delete, CSV import template and CSV export.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/server/modules/organization src/server/modules/customers && npm run typecheck`  
Expected: domain tests and typecheck pass.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features/organization src/features/customers src/server/modules
git commit -m "feat: add organization and customer management"
```

### Task 6: Project delivery and contract collection

**Files:**
- Create: `src/server/modules/projects/*`, `src/server/modules/contracts/*`
- Create: `src/features/projects/*`, `src/features/contracts/*`
- Create: `src/app/(dashboard)/projects/page.tsx`
- Create: `src/app/(dashboard)/contracts/page.tsx`
- Create: `src/app/api/projects/route.ts`, `src/app/api/contracts/route.ts`

- [ ] **Step 1: Write failing finance tests**

```ts
expect(contractBalance({ amount: 1200000, collected: 800000 })).toBe(400000);
expect(projectProgress([{ progress: 50 }, { progress: 100 }])).toBe(75);
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/server/modules/projects src/server/modules/contracts`  
Expected: FAIL because calculations are missing.

- [ ] **Step 3: Implement project and contract flows**

Add project list/kanban, milestones, members, progress and risk states. Add contract list, amount/status filters, payment plans, payment registration, overdue warnings and approval status.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/server/modules/projects src/server/modules/contracts && npm run typecheck`  
Expected: all project and contract tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features/projects src/features/contracts src/server/modules
git commit -m "feat: add project delivery and contract collection"
```

### Task 7: Files, approvals, notifications and system administration

**Files:**
- Create: `src/server/storage/*`, `src/server/modules/approvals/*`
- Create: `src/features/files/*`, `src/features/approvals/*`, `src/features/system/*`
- Create: `src/app/(dashboard)/files/page.tsx`
- Create: `src/app/(dashboard)/approvals/page.tsx`
- Create: `src/app/(dashboard)/system/page.tsx`

- [ ] **Step 1: Write failing approval transition test**

```ts
expect(nextApprovalStatus("PENDING", "APPROVE", false)).toBe("PENDING");
expect(nextApprovalStatus("PENDING", "APPROVE", true)).toBe("APPROVED");
expect(nextApprovalStatus("PENDING", "REJECT", false)).toBe("REJECTED");
```

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/server/modules/approvals`  
Expected: FAIL because transition rules are missing.

- [ ] **Step 3: Implement operational modules**

Add local/S3 storage adapter, file metadata and business links; approvals inbox and action history; notifications; role/permission matrix; settings; login and audit log tables.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- src/server/storage src/server/modules/approvals && npm run typecheck`  
Expected: storage and approval tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app src/features src/server
git commit -m "feat: add files approvals and system administration"
```

### Task 8: Deployment, documentation and continuous integration

**Files:**
- Create: `.env.example`, `Dockerfile`, `docker-compose.yml`
- Create: `.github/workflows/ci.yml`
- Create: `README.md`, `docs/architecture.md`
- Create: `tests/e2e/smoke.spec.ts`, `playwright.config.ts`

- [ ] **Step 1: Write the failing smoke test**

```ts
await page.goto("/login");
await expect(page.getByRole("heading", { name: "欢迎回来" })).toBeVisible();
```

- [ ] **Step 2: Verify RED**

Run: `npm run test:e2e -- tests/e2e/smoke.spec.ts`  
Expected: FAIL until the configured app is started and the route is available.

- [ ] **Step 3: Add deployment and docs**

Document local setup, demo credentials, scripts, architecture, security model, screenshots and production deployment. CI runs install, Prisma generation, lint, typecheck, unit tests and build.

- [ ] **Step 4: Verify GREEN**

Run: `npm run lint && npm run typecheck && npm test && npm run build`  
Expected: every command exits zero.

- [ ] **Step 5: Commit**

```bash
git add .env.example Dockerfile docker-compose.yml .github README.md docs tests playwright.config.ts
git commit -m "docs: add deployment guide and quality gates"
```

### Task 9: Final visual QA, requirement audit and release

**Files:**
- Modify: any files identified by final review
- Create: `docs/release-checklist.md`

- [ ] **Step 1: Audit every design-spec section**

Create a checklist mapping dashboard, organization, customers, projects, contracts, files, approvals, RBAC, audit, responsive behavior, themes, tests, docs and deployment to concrete routes and tests.

- [ ] **Step 2: Run the complete verification suite**

Run: `npm run lint && npm run typecheck && npm test -- --run && npm run build`  
Expected: zero failures and successful production build.

- [ ] **Step 3: Inspect Git state**

Run: `git status --short && git log --oneline --decorate -12`  
Expected: clean worktree and intentional task commits.

- [ ] **Step 4: Merge implementation branch and push**

```bash
git checkout main
git merge --no-ff feat/nexus-v1
git push origin main
```

Expected: GitHub `main` points to the verified release commit.
