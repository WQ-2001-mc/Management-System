"use client";

import {
  AppstoreOutlined,
  BarChartOutlined,
  BellOutlined,
  CheckSquareOutlined,
  CloudOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  PlusOutlined,
  ProjectOutlined,
  SearchOutlined,
  SettingOutlined,
  SunOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Input, Tooltip } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import styles from "./app-shell.module.css";

const navigation = [
  { href: "/dashboard", label: "工作台", icon: AppstoreOutlined },
  { href: "/analytics", label: "数据洞察", icon: BarChartOutlined },
  { href: "/organization", label: "组织人员", icon: TeamOutlined },
  { href: "/customers", label: "客户中心", icon: CustomerServiceOutlined },
  { href: "/projects", label: "项目交付", icon: ProjectOutlined },
  { href: "/contracts", label: "合同回款", icon: FileTextOutlined },
  { href: "/files", label: "文件资产", icon: FolderOpenOutlined },
  { href: "/approvals", label: "审批流程", icon: CheckSquareOutlined },
  { href: "/system", label: "系统管理", icon: SettingOutlined },
];

const quickLinks = [
  { href: "/approvals", label: "我的待办", count: 12 },
  { href: "/projects", label: "我发起的", count: 0 },
  { href: "/customers", label: "我关注的", count: 5 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const current = useMemo(
    () => navigation.find((item) => pathname.startsWith(item.href)),
    [pathname],
  );

  return (
    <div className={`${styles.shell} ${collapsed ? styles.collapsed : ""}`}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>N</span>
          {!collapsed && (
            <span>
              <strong>NEXUS</strong>
              <small>企业数据平台</small>
            </span>
          )}
        </div>

        <nav className={styles.nav}>
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Tooltip key={item.href} title={collapsed ? item.label : undefined} placement="right">
                <Link className={`${styles.navItem} ${active ? styles.active : ""}`} href={item.href}>
                  <Icon />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </Tooltip>
            );
          })}
        </nav>

        <div className={styles.quick}>
          {!collapsed && <span className={styles.navCaption}>快捷入口</span>}
          {quickLinks.map((item) => (
            <Link className={styles.quickItem} href={item.href} key={item.label}>
              <span className={styles.quickDot} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.count > 0 && <Badge count={item.count} size="small" />}
            </Link>
          ))}
        </div>

        <button className={styles.collapseButton} onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          {!collapsed && <span>收起导航</span>}
        </button>
      </aside>

      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.company}>
            <span className={styles.companyIcon}>启</span>
            <strong>启衡科技（上海）有限公司</strong>
            <span className={styles.chevron}>⌄</span>
          </div>
          <Input
            className={styles.search}
            prefix={<SearchOutlined />}
            placeholder="搜索客户、项目、合同（⌘K）"
            variant="borderless"
          />
          <div className={styles.headerActions}>
            <Dropdown
              menu={{
                items: [
                  { key: "customer", label: <Link href="/customers">新建客户</Link> },
                  { key: "project", label: <Link href="/projects">新建项目</Link> },
                  { key: "contract", label: <Link href="/contracts">新建合同</Link> },
                  { key: "approval", label: <Link href="/approvals">发起审批</Link> },
                ],
              }}
            >
              <Button type="primary" icon={<PlusOutlined />}>新建</Button>
            </Dropdown>
            <Badge count={12} size="small"><Button type="text" icon={<BellOutlined />} /></Badge>
            <Button type="text" icon={dark ? <SunOutlined /> : <MoonOutlined />} onClick={() => setDark((value) => !value)} />
            <Avatar src="https://i.pravatar.cc/80?img=12">李</Avatar>
            {!collapsed && (
              <div className={styles.profile}>
                <strong>李明远</strong>
                <small>产品交付部</small>
              </div>
            )}
          </div>
        </header>

        <div className={styles.contextBar}>
          <div>
            <span>企业管理</span>
            <span>/</span>
            <strong>{current?.label ?? "工作台"}</strong>
          </div>
          <span className={styles.sync}><CloudOutlined /> 数据已同步</span>
        </div>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

