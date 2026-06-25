export type StatusTone = "blue" | "green" | "orange" | "red" | "gray" | "purple";

export interface Customer {
  id: string;
  name: string;
  industry: string;
  region: string;
  level: "A" | "B" | "C";
  owner: string;
  contact: string;
  phone: string;
  value: number;
  status: "重点跟进" | "稳定合作" | "待激活";
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  customer: string;
  owner: string;
  budget: number;
  progress: number;
  status: "规划中" | "进行中" | "风险" | "已完成";
  deadline: string;
  members: number;
}

export interface Contract {
  id: string;
  number: string;
  name: string;
  customer: string;
  owner: string;
  amount: number;
  collected: number;
  status: "执行中" | "待签署" | "已完成" | "即将到期";
  signedAt: string;
  expiresAt: string;
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  title: string;
  email: string;
  phone: string;
  role: string;
  status: "在职" | "休假" | "停用";
}

export interface Approval {
  id: string;
  title: string;
  type: string;
  applicant: string;
  amount?: number;
  submittedAt: string;
  status: "待审批" | "已通过" | "已驳回";
  step: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  owner: string;
  relatedTo: string;
  updatedAt: string;
}

