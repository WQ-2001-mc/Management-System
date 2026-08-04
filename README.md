# NEXUS 企业数据平台

一个新颖、专业、可扩展的企业数据管理系统。它将组织、客户、项目、合同、文件、审批、经营分析、权限与审计集中在同一套工作台中。

![NEXUS Dashboard](docs/design/nexus-dashboard-reference.png)

## 功能

- 现代经营工作台：营收、回款、目标、风险、审批与动态
- 数据洞察：现金流、业务结构、客户转化漏斗和经营建议
- 组织人员：部门架构、员工目录、角色和状态
- 客户中心：搜索、筛选、新建、删除、详情与跟进记录
- 项目交付：列表/看板、预算、成员、进度、状态与风险
- 合同回款：合同台账、回款进度、到期和逾期风险
- 文件资产：上传入口、业务关联、下载与删除
- 审批流程：待办、通过、驳回和流程状态
- 系统管理：企业设置、权限矩阵、安全状态与审计日志
- 明暗主题、响应式布局、真实 SQLite 数据模型和 REST API

## 技术栈

Next.js 16 · React 19 · TypeScript · Ant Design 6 · ECharts 6 · Prisma 6 · SQLite · Zod · Vitest

## 快速开始

要求 Node.js 22 LTS。

```bash
git clone https://github.com/WQ-2001-mc/Management-System.git
cd Management-System
cp .env.example .env
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

打开 <http://localhost:3000>，或直接访问 <http://localhost:3000/login>。

演示管理员：

```text
邮箱：admin@nexus.local
密码：Nexus@2026
```

部门负责人：

```text
邮箱：manager@nexus.local
密码：Manager@2026
```

> 演示登录用于本地展示。公开部署前应接入 Auth.js、企业 SSO 或可信身份提供商，并更换 `SESSION_SECRET`。

## 常用命令

```bash
npm run dev          # 开发服务器
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm run test:run     # 单元测试
npm run build        # 生产构建
npm run db:seed      # 重建演示数据
```

## Docker

```bash
docker compose up --build
```

SQLite 数据和上传文件将保存在 `nexus_data` volume 中。生产环境请修改 compose 中的会话密钥，并根据规模切换 PostgreSQL 和对象存储。

## 数据 API

`GET /api/customers` 获取当前租户客户；`POST /api/customers` 创建客户并自动写入审计日志。

示例：

```bash
curl -c /tmp/nexus.cookies \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@nexus.local","password":"Nexus@2026"}' \
  http://localhost:3000/api/auth/login

curl -X POST http://localhost:3000/api/customers \
  -b /tmp/nexus.cookies \
  -H 'Content-Type: application/json' \
  -d '{"name":"上海智联科技有限公司","level":"A","industry":"科技服务","region":"华东","owner":"李明远","value":680000}'
```

## 质量保障

GitHub Actions 在每次提交和 Pull Request 上执行 Prisma Client 生成、Lint、类型检查、单元测试和生产构建。

架构说明见 [docs/architecture.md](docs/architecture.md)，详细设计见 [系统设计规格](docs/superpowers/specs/2026-06-25-enterprise-data-management-system-design.md)。
版本维护记录见 [docs/maintenance-log.md](docs/maintenance-log.md)。

## License

MIT
