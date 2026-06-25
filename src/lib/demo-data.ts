import type {
  Approval,
  Contract,
  Customer,
  Employee,
  FileItem,
  Project,
} from "./types";

export const customers: Customer[] = [
  { id: "CUS-001", name: "华东医药集团", industry: "医疗健康", region: "华东", level: "A", owner: "张磊", contact: "周静", phone: "138****6621", value: 3280000, status: "重点跟进", updatedAt: "今天 10:32" },
  { id: "CUS-002", name: "上海银行", industry: "金融服务", region: "华东", level: "A", owner: "王磊", contact: "陈诚", phone: "139****2108", value: 2760000, status: "稳定合作", updatedAt: "今天 09:48" },
  { id: "CUS-003", name: "北京链家", industry: "房地产", region: "华北", level: "B", owner: "陈思远", contact: "高宁", phone: "136****8990", value: 1860000, status: "稳定合作", updatedAt: "昨天 18:20" },
  { id: "CUS-004", name: "平安普惠", industry: "金融科技", region: "华南", level: "A", owner: "刘佳", contact: "许文", phone: "137****3372", value: 2450000, status: "重点跟进", updatedAt: "昨天 16:06" },
  { id: "CUS-005", name: "华为技术有限公司", industry: "科技制造", region: "华南", level: "A", owner: "李明远", contact: "韩卓", phone: "135****9021", value: 4180000, status: "稳定合作", updatedAt: "06-24 14:30" },
  { id: "CUS-006", name: "中国石化", industry: "能源", region: "华中", level: "B", owner: "王磊", contact: "邹琳", phone: "133****7026", value: 1680000, status: "待激活", updatedAt: "06-23 11:18" },
  { id: "CUS-007", name: "蔚来汽车", industry: "新能源汽车", region: "华东", level: "A", owner: "张磊", contact: "任航", phone: "131****4098", value: 3560000, status: "重点跟进", updatedAt: "06-22 17:40" },
];

export const projects: Project[] = [
  { id: "PRJ-2026-021", name: "智慧园区平台建设项目", customer: "华东医药集团", owner: "张磊", budget: 1280000, progress: 68, status: "进行中", deadline: "2026-08-15", members: 12 },
  { id: "PRJ-2026-018", name: "数据中台升级项目", customer: "上海银行", owner: "王磊", budget: 980000, progress: 45, status: "进行中", deadline: "2026-09-30", members: 9 },
  { id: "PRJ-2026-014", name: "供应链协同系统", customer: "北京链家", owner: "陈思远", budget: 860000, progress: 32, status: "风险", deadline: "2026-08-20", members: 8 },
  { id: "PRJ-2026-012", name: "移动端应用开发", customer: "平安普惠", owner: "刘佳", budget: 650000, progress: 80, status: "进行中", deadline: "2026-07-05", members: 7 },
  { id: "PRJ-2026-009", name: "智能质检平台", customer: "华为技术有限公司", owner: "李明远", budget: 1520000, progress: 100, status: "已完成", deadline: "2026-06-10", members: 14 },
  { id: "PRJ-2026-024", name: "渠道运营数字化", customer: "蔚来汽车", owner: "张磊", budget: 1130000, progress: 12, status: "规划中", deadline: "2026-11-18", members: 6 },
];

export const contracts: Contract[] = [
  { id: "CON-001", number: "HT-2026-0088", name: "智慧园区平台项目合同", customer: "华东医药集团", owner: "张磊", amount: 1280000, collected: 832000, status: "执行中", signedAt: "2026-01-18", expiresAt: "2027-01-31" },
  { id: "CON-002", number: "HT-2026-0072", name: "数据中台升级服务合同", customer: "上海银行", owner: "王磊", amount: 980000, collected: 392000, status: "执行中", signedAt: "2026-02-05", expiresAt: "2026-12-31" },
  { id: "CON-003", number: "HT-2026-0066", name: "供应链协同开发合同", customer: "北京链家", owner: "陈思远", amount: 860000, collected: 258000, status: "即将到期", signedAt: "2025-10-20", expiresAt: "2026-07-20" },
  { id: "CON-004", number: "HT-2026-0091", name: "移动端应用开发合同", customer: "平安普惠", owner: "刘佳", amount: 650000, collected: 487500, status: "执行中", signedAt: "2026-03-12", expiresAt: "2026-10-10" },
  { id: "CON-005", number: "HT-2026-0098", name: "年度产品维护服务合同", customer: "华为技术有限公司", owner: "李明远", amount: 1200000, collected: 1200000, status: "已完成", signedAt: "2025-12-20", expiresAt: "2026-12-31" },
  { id: "CON-006", number: "HT-2026-0112", name: "IT 运维服务合同", customer: "中国石化", owner: "王磊", amount: 800000, collected: 0, status: "待签署", signedAt: "-", expiresAt: "2027-06-30" },
];

export const employees: Employee[] = [
  { id: "EMP-001", name: "李明远", department: "产品交付部", title: "产品总监", email: "limingyuan@nexus.local", phone: "138****6628", role: "部门负责人", status: "在职" },
  { id: "EMP-002", name: "张磊", department: "产品交付部", title: "高级项目经理", email: "zhanglei@nexus.local", phone: "136****0912", role: "项目经理", status: "在职" },
  { id: "EMP-003", name: "王磊", department: "商业增长部", title: "客户成功经理", email: "wanglei@nexus.local", phone: "139****3880", role: "业务经理", status: "在职" },
  { id: "EMP-004", name: "陈思远", department: "技术研发部", title: "技术经理", email: "chensiyuan@nexus.local", phone: "137****1201", role: "部门负责人", status: "在职" },
  { id: "EMP-005", name: "刘佳", department: "商业增长部", title: "销售经理", email: "liujia@nexus.local", phone: "135****8820", role: "业务经理", status: "休假" },
  { id: "EMP-006", name: "周雨桐", department: "财务管理部", title: "财务主管", email: "zhouyutong@nexus.local", phone: "133****7781", role: "审批管理员", status: "在职" },
];

export const approvals: Approval[] = [
  { id: "APP-001", title: "智慧园区项目合同首付款", type: "合同付款", applicant: "张磊", amount: 420000, submittedAt: "10 分钟前", status: "待审批", step: "财务复核" },
  { id: "APP-002", title: "服务器资源年度采购", type: "采购申请", applicant: "陈思远", amount: 128000, submittedAt: "25 分钟前", status: "待审批", step: "部门负责人" },
  { id: "APP-003", title: "市场推广活动费用报销", type: "费用报销", applicant: "刘佳", amount: 28600, submittedAt: "1 小时前", status: "待审批", step: "财务复核" },
  { id: "APP-004", title: "上海银行项目变更申请", type: "项目变更", applicant: "王磊", submittedAt: "昨天 16:20", status: "已通过", step: "已结束" },
  { id: "APP-005", title: "设计系统外包采购", type: "采购申请", applicant: "李明远", amount: 68000, submittedAt: "06-23 14:10", status: "已驳回", step: "已结束" },
];

export const files: FileItem[] = [
  { id: "FILE-001", name: "智慧园区平台项目实施方案.pdf", type: "PDF", size: "8.6 MB", owner: "张磊", relatedTo: "智慧园区平台建设项目", updatedAt: "今天 10:20" },
  { id: "FILE-002", name: "2026 年第二季度经营分析.xlsx", type: "XLSX", size: "2.4 MB", owner: "周雨桐", relatedTo: "经营分析", updatedAt: "今天 09:36" },
  { id: "FILE-003", name: "数据中台接口设计说明.docx", type: "DOCX", size: "5.1 MB", owner: "陈思远", relatedTo: "数据中台升级项目", updatedAt: "昨天 18:04" },
  { id: "FILE-004", name: "华东医药集团合同扫描件.pdf", type: "PDF", size: "12.8 MB", owner: "张磊", relatedTo: "HT-2026-0088", updatedAt: "06-24 15:22" },
  { id: "FILE-005", name: "品牌视觉规范 V3.fig", type: "FIG", size: "24.5 MB", owner: "李明远", relatedTo: "设计资产", updatedAt: "06-22 11:09" },
];

export const departments = [
  { name: "产品交付部", count: 28, lead: "李明远", color: "#5b5ce2" },
  { name: "技术研发部", count: 46, lead: "陈思远", color: "#19b9d1" },
  { name: "商业增长部", count: 22, lead: "王磊", color: "#10a779" },
  { name: "财务管理部", count: 9, lead: "周雨桐", color: "#f5a524" },
  { name: "人力行政部", count: 12, lead: "孙晓彤", color: "#ef5b66" },
];

export const trendData = [
  { month: "1月", revenue: 118, collection: 82 },
  { month: "2月", revenue: 142, collection: 96 },
  { month: "3月", revenue: 151, collection: 112 },
  { month: "4月", revenue: 168, collection: 126 },
  { month: "5月", revenue: 205, collection: 158 },
  { month: "6月", revenue: 245, collection: 189 },
];
