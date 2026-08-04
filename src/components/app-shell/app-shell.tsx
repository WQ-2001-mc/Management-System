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
import { AutoComplete, Avatar, Badge, Button, Dropdown, Input, Tooltip } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { appNavigation, searchNavigation } from "@/lib/app-navigation";
import {
  parseCollapsedPreference,
  parseThemePreference,
  sidebarStorageKey,
  themeStorageKey,
} from "@/lib/ui-preferences";

import styles from "./app-shell.module.css";

const icons = {
  "/dashboard": AppstoreOutlined,
  "/analytics": BarChartOutlined,
  "/organization": TeamOutlined,
  "/customers": CustomerServiceOutlined,
  "/projects": ProjectOutlined,
  "/contracts": FileTextOutlined,
  "/files": FolderOpenOutlined,
  "/approvals": CheckSquareOutlined,
  "/system": SettingOutlined,
} as const;

const navigation = appNavigation.map((item) => ({
  ...item,
  icon: icons[item.href as keyof typeof icons],
}));

const quickLinks = [
  { href: "/approvals", label: "我的待办", count: 12 },
  { href: "/projects", label: "我发起的", count: 0 },
  { href: "/customers", label: "我关注的", count: 5 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const storedTheme = parseThemePreference(localStorage.getItem(themeStorageKey));
    const storedCollapsed = parseCollapsedPreference(localStorage.getItem(sidebarStorageKey));
    setDark(storedTheme ? storedTheme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
    setCollapsed(storedCollapsed ?? false);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    localStorage.setItem(themeStorageKey, dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem(sidebarStorageKey, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.querySelector("input")?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

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

        <button
          className={styles.collapseButton}
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "展开导航" : "收起导航"}
          title={collapsed ? "展开导航" : "收起导航"}
        >
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
          <div className={styles.search} ref={searchRef}>
            <AutoComplete
              value={query}
              onChange={setQuery}
              onSelect={(href) => {
                setQuery("");
                router.push(href);
              }}
              options={searchNavigation(query).map((item) => ({
                value: item.href,
                label: <span className={styles.searchOption}><strong>{item.label}</strong><small>{item.href}</small></span>,
              }))}
              placeholder="搜索功能页面"
              aria-label="搜索功能页面"
            >
              <Input prefix={<SearchOutlined />} suffix={<kbd>⌘K</kbd>} variant="borderless" />
            </AutoComplete>
          </div>
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
            <Tooltip title="通知中心"><Badge count={12} size="small"><Button aria-label="通知中心" type="text" icon={<BellOutlined />} /></Badge></Tooltip>
            <Tooltip title={dark ? "切换浅色主题" : "切换深色主题"}>
              <Button aria-label={dark ? "切换浅色主题" : "切换深色主题"} type="text" icon={dark ? <SunOutlined /> : <MoonOutlined />} onClick={() => setDark((value) => !value)} />
            </Tooltip>
            <Avatar>李</Avatar>
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
