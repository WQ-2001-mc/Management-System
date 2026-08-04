export interface AppNavigationItem {
  href: string;
  label: string;
  keywords: string[];
}

export const appNavigation: AppNavigationItem[] = [
  { href: "/dashboard", label: "工作台", keywords: ["首页", "经营", "dashboard"] },
  { href: "/analytics", label: "数据洞察", keywords: ["分析", "报表", "analytics"] },
  { href: "/organization", label: "组织人员", keywords: ["员工", "部门", "organization"] },
  { href: "/customers", label: "客户中心", keywords: ["客户", "customer", "crm"] },
  { href: "/projects", label: "项目交付", keywords: ["项目", "project"] },
  { href: "/contracts", label: "合同回款", keywords: ["合同", "回款", "contract"] },
  { href: "/files", label: "文件资产", keywords: ["文件", "文档", "file"] },
  { href: "/approvals", label: "审批流程", keywords: ["审批", "待办", "approval"] },
  { href: "/system", label: "系统管理", keywords: ["设置", "权限", "审计", "system"] },
];

export function searchNavigation(query: string) {
  const normalized = query.trim().toLocaleLowerCase("zh-CN");
  if (!normalized) return appNavigation;
  return appNavigation.filter((item) =>
    [item.label, ...item.keywords].some((value) =>
      value.toLocaleLowerCase("zh-CN").includes(normalized),
    ),
  );
}

