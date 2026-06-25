# NEXUS Architecture

## Overview

NEXUS uses a modular-monolith structure: one Next.js deployment contains the web interface, route handlers and domain services, while module boundaries keep business logic independent.

```text
Browser
  ├─ App Router pages and client interactions
  ├─ Route handlers with Zod validation
  ├─ Domain modules and permission checks
  ├─ Prisma data access
  └─ SQLite by default / PostgreSQL-ready schema
```

## Module boundaries

- `src/app`: routing and HTTP boundaries only.
- `src/features`: user-facing domain views.
- `src/server/modules`: validation and business operations.
- `src/server/db`: database connection management.
- `src/lib`: pure shared rules and display data.

The business rules in `src/lib/business-rules.ts` are intentionally framework-independent and covered by unit tests.

## Data and tenancy

Every domain record belongs to a `Tenant`. Queries in production integrations must include `tenantId`; the customer API demonstrates this by resolving the configured tenant before each read or write. Important mutations create `AuditLog` records.

SQLite is the zero-setup default. Prisma keeps database access portable; a production deployment can switch to PostgreSQL by changing the provider and `DATABASE_URL`, then applying a migration.

## Security model

- Server-side validation uses Zod.
- RBAC supports exact permissions and administrator wildcard access.
- Sensitive configuration lives in environment variables.
- Database files, uploads and secrets are ignored by Git.
- Demo credentials are intentionally limited to local demonstration. Replace the demo login helper with an identity provider or Auth.js adapter before public production use.

## UI system

The interface uses an 8 px spacing rhythm, graphite navigation, warm neutral surfaces and restrained indigo/cyan accents. ECharts powers analytical graphics. Tables expose search, filtering affordances, pagination, detail drawers and workflow actions.

