"use client";

import {
  AppstoreOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExportOutlined,
  FileOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  TableOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  Timeline,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { EChartsOption } from "echarts";
import { useMemo, useState } from "react";

import { EChart } from "@/components/charts/echart";
import {
  approvals as initialApprovals,
  contracts as initialContracts,
  customers as initialCustomers,
  departments,
  employees,
  files as initialFiles,
  projects as initialProjects,
  trendData,
} from "@/lib/demo-data";
import type { Approval, Contract, Customer, FileItem, Project } from "@/lib/types";

import styles from "./management.module.css";

const money = new Intl.NumberFormat("zh-CN");

function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className={styles.pageHeading}>
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
      </div>
      <div className={styles.headingActions}>{actions}</div>
    </header>
  );
}

function Toolbar({
  placeholder,
  onSearch,
  children,
}: {
  placeholder: string;
  onSearch: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={styles.toolbar}>
      <Input allowClear prefix={<SearchOutlined />} placeholder={placeholder} onChange={(event) => onSearch(event.target.value)} />
      <Space>
        <Button icon={<FilterOutlined />}>筛选</Button>
        <Button icon={<ReloadOutlined />}>刷新</Button>
        {children}
      </Space>
    </div>
  );
}

function toneForStatus(status: string) {
  if (["稳定合作", "已完成", "在职", "已通过", "执行中"].includes(status)) return "green";
  if (["风险", "即将到期", "已驳回", "停用"].includes(status)) return "red";
  if (["待签署", "待审批", "规划中", "休假", "重点跟进"].includes(status)) return "orange";
  return "blue";
}

export function AnalyticsView() {
  const revenueOption = useMemo<EChartsOption>(() => ({
    color: ["#5b5ce2", "#18b6d5"],
    tooltip: { trigger: "axis" },
    legend: { data: ["营业收入", "回款金额"], right: 0 },
    grid: { left: 12, right: 18, top: 46, bottom: 16, containLabel: true },
    xAxis: { type: "category", data: trendData.map((item) => item.month), axisTick: { show: false } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: "#edf0f5", type: "dashed" } } },
    series: [
      { name: "营业收入", type: "bar", barWidth: 18, data: trendData.map((item) => item.revenue), itemStyle: { borderRadius: [6, 6, 0, 0] } },
      { name: "回款金额", type: "line", smooth: true, data: trendData.map((item) => item.collection), symbolSize: 8, lineStyle: { width: 3 } },
    ],
  }), []);
  const funnelOption = useMemo<EChartsOption>(() => ({
    color: ["#5b5ce2", "#6d79ee", "#4ca6e8", "#1db9c8", "#10a779"],
    tooltip: { trigger: "item" },
    series: [{ type: "funnel", left: "8%", top: 18, bottom: 18, width: "84%", min: 0, max: 420, minSize: "20%", maxSize: "100%", sort: "descending", gap: 5, label: { show: true, position: "inside", color: "#fff" }, itemStyle: { borderWidth: 0, borderRadius: 5 }, data: [
      { value: 420, name: "潜在客户 420" }, { value: 286, name: "有效商机 286" }, { value: 164, name: "方案沟通 164" }, { value: 92, name: "合同谈判 92" }, { value: 46, name: "成交客户 46" },
    ] }],
  }), []);

  return (
    <>
      <PageHeading eyebrow="DATA INTELLIGENCE" title="数据洞察" description="从经营指标到业务转化，持续发现增长机会与风险。" actions={<><Button icon={<DownloadOutlined />}>导出报告</Button><Button type="primary">创建分析</Button></>} />
      <Row gutter={[16, 16]} className={styles.statRow}>
        {[["年度累计营收", 12680000, "同比 +24.8%"], ["年度累计回款", 9840000, "回款率 77.6%"], ["销售管道价值", 18560000, "较上月 +12.3%"], ["客户生命周期价值", 428000, "均值 +8.2%"]].map(([title, value, note]) => (
          <Col xs={24} sm={12} xl={6} key={String(title)}><Card><Statistic title={title} value={Number(value)} prefix="¥" /><span className={styles.positive}>{note}</span></Card></Col>
        ))}
      </Row>
      <div className={styles.analyticsGrid}>
        <Card title="营收与现金流分析" extra={<Segmented options={["月度", "季度", "年度"]} defaultValue="月度" />}><EChart option={revenueOption} height={360} /></Card>
        <Card title="客户转化漏斗"><EChart option={funnelOption} height={360} /></Card>
      </div>
      <div className={styles.analyticsGrid}>
        <Card title="业务结构">
          <div className={styles.metricList}>
            {[["软件与平台", 43, "#5b5ce2"], ["技术服务", 28, "#18b6d5"], ["咨询方案", 17, "#10a779"], ["运维与订阅", 12, "#f5a524"]].map(([label, value, color]) => (
              <div key={String(label)}><div><span>{label}</span><strong>{value}%</strong></div><Progress percent={Number(value)} showInfo={false} strokeColor={String(color)} /></div>
            ))}
          </div>
        </Card>
        <Card title="经营诊断建议">
          <List dataSource={[
            ["回款效率", "本月回款率较季度均值低 3.4%，建议优先跟进 3 笔逾期款项。"],
            ["项目交付", "供应链协同系统存在延期风险，资源负载已达到 92%。"],
            ["客户增长", "华东地区新增线索质量最高，可增加医疗行业活动投入。"],
          ]} renderItem={(item) => <List.Item><List.Item.Meta avatar={<Avatar icon={<SafetyCertificateOutlined />} />} title={item[0]} description={item[1]} /></List.Item>} />
        </Card>
      </div>
    </>
  );
}

export function OrganizationView() {
  const [query, setQuery] = useState("");
  const filtered = employees.filter((item) => `${item.name}${item.department}${item.title}`.includes(query));
  const columns: ColumnsType<(typeof employees)[number]> = [
    { title: "员工", dataIndex: "name", render: (name: string, record) => <div className={styles.person}><Avatar>{name.slice(-1)}</Avatar><div><strong>{name}</strong><small>{record.email}</small></div></div> },
    { title: "部门", dataIndex: "department" },
    { title: "职位", dataIndex: "title" },
    { title: "角色", dataIndex: "role", render: (value) => <Tag color="geekblue">{value}</Tag> },
    { title: "联系电话", dataIndex: "phone" },
    { title: "状态", dataIndex: "status", render: (value) => <Tag color={toneForStatus(value)}>{value}</Tag> },
    { title: "操作", render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];
  return (
    <>
      <PageHeading eyebrow="ORGANIZATION" title="组织与人员" description="清晰管理部门架构、员工档案、岗位与数据权限。" actions={<><Button icon={<TeamOutlined />}>调整组织</Button><Button type="primary" icon={<PlusOutlined />}>邀请成员</Button></>} />
      <div className={styles.departmentGrid}>
        {departments.map((item) => <Card key={item.name}><div className={styles.departmentCard}><span style={{ background: item.color }}>{item.name.slice(0, 1)}</span><div><strong>{item.name}</strong><small>负责人 · {item.lead}</small></div><b>{item.count}<small>人</small></b></div></Card>)}
      </div>
      <Card className={styles.tableCard} title="员工目录" extra={<Tag>{employees.length} 名成员</Tag>}>
        <Toolbar placeholder="搜索员工、部门或职位" onSearch={setQuery}><Button icon={<ExportOutlined />}>导出</Button></Toolbar>
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 6 }} scroll={{ x: 900 }} />
      </Card>
    </>
  );
}

export function CustomersView() {
  const [items, setItems] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form] = Form.useForm();
  const filtered = items.filter((item) => `${item.name}${item.industry}${item.owner}`.includes(query));
  const columns: ColumnsType<Customer> = [
    { title: "客户名称", dataIndex: "name", render: (value, record) => <button className={styles.linkButton} onClick={() => setSelected(record)}><strong>{value}</strong><small>{record.id}</small></button> },
    { title: "行业", dataIndex: "industry" },
    { title: "地区", dataIndex: "region" },
    { title: "等级", dataIndex: "level", render: (value) => <Tag color={value === "A" ? "purple" : "blue"}>{value} 级</Tag> },
    { title: "负责人", dataIndex: "owner" },
    { title: "客户价值", dataIndex: "value", render: (value) => `¥ ${money.format(value)}` },
    { title: "状态", dataIndex: "status", render: (value) => <Tag color={toneForStatus(value)}>{value}</Tag> },
    { title: "最近更新", dataIndex: "updatedAt" },
    { title: "操作", render: (_, record) => <Space><Button type="text" icon={<EditOutlined />} onClick={() => setSelected(record)} /><Button type="text" danger icon={<DeleteOutlined />} onClick={() => setItems((current) => current.filter((item) => item.id !== record.id))} /></Space> },
  ];
  const addCustomer = (values: Partial<Customer>) => {
    const customer: Customer = { id: `CUS-${String(items.length + 1).padStart(3, "0")}`, name: values.name ?? "新客户", industry: values.industry ?? "其他", region: values.region ?? "华东", level: values.level ?? "B", owner: "李明远", contact: values.contact ?? "-", phone: values.phone ?? "-", value: Number(values.value ?? 0), status: "重点跟进", updatedAt: "刚刚" };
    setItems((current) => [customer, ...current]);
    setOpen(false);
    form.resetFields();
    message.success("客户创建成功");
  };
  return (
    <>
      <PageHeading eyebrow="CUSTOMER SUCCESS" title="客户中心" description="统一沉淀客户档案、联系人、跟进记录与业务价值。" actions={<><Button icon={<ExportOutlined />}>导入 / 导出</Button><Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>新建客户</Button></>} />
      <Row gutter={[16, 16]} className={styles.statRow}>
        <Col xs={12} lg={6}><Card><Statistic title="客户总数" value={236} suffix="家" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="A 级客户" value={68} suffix="家" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="本月新增" value={46} suffix="家" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="客户总价值" value={18.56} suffix="百万元" /></Card></Col>
      </Row>
      <Card className={styles.tableCard}>
        <Toolbar placeholder="搜索客户名称、行业或负责人" onSearch={setQuery}><Button icon={<DownloadOutlined />}>下载数据</Button></Toolbar>
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 7, showTotal: (total) => `共 ${total} 条` }} scroll={{ x: 1050 }} />
      </Card>
      <Modal title="新建客户" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="创建客户">
        <Form form={form} layout="vertical" onFinish={addCustomer}>
          <Form.Item name="name" label="客户名称" rules={[{ required: true, message: "请输入客户名称" }]}><Input /></Form.Item>
          <Row gutter={12}><Col span={12}><Form.Item name="industry" label="所属行业"><Input /></Form.Item></Col><Col span={12}><Form.Item name="region" label="地区"><Select options={["华东", "华北", "华南", "华中", "西部"].map((value) => ({ value }))} /></Form.Item></Col></Row>
          <Row gutter={12}><Col span={12}><Form.Item name="level" label="客户等级"><Select options={["A", "B", "C"].map((value) => ({ value }))} /></Form.Item></Col><Col span={12}><Form.Item name="value" label="预估价值"><InputNumber prefix="¥" style={{ width: "100%" }} /></Form.Item></Col></Row>
          <Row gutter={12}><Col span={12}><Form.Item name="contact" label="联系人"><Input /></Form.Item></Col><Col span={12}><Form.Item name="phone" label="联系电话"><Input /></Form.Item></Col></Row>
        </Form>
      </Modal>
      <Drawer width={520} title="客户详情" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <><Descriptions column={1} bordered items={[
          { key: "name", label: "客户名称", children: selected.name }, { key: "industry", label: "行业地区", children: `${selected.industry} · ${selected.region}` }, { key: "owner", label: "负责人", children: selected.owner }, { key: "contact", label: "主要联系人", children: `${selected.contact} · ${selected.phone}` }, { key: "value", label: "客户价值", children: `¥ ${money.format(selected.value)}` },
        ]} /><h3 className={styles.drawerTitle}>最近跟进</h3><Timeline items={[{ children: "完成季度业务回顾，客户满意度良好" }, { children: "提交智慧运营方案 V2.1" }, { children: "确认下一阶段项目范围与预算" }]} /></>}
      </Drawer>
    </>
  );
}

export function ProjectsView() {
  const [items] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [view, setView] = useState("列表");
  const filtered = items.filter((item) => `${item.name}${item.customer}${item.owner}`.includes(query));
  const columns: ColumnsType<Project> = [
    { title: "项目", dataIndex: "name", render: (value, record) => <div><strong>{value}</strong><small className={styles.block}>{record.id} · {record.members} 名成员</small></div> },
    { title: "客户", dataIndex: "customer" },
    { title: "负责人", dataIndex: "owner" },
    { title: "预算", dataIndex: "budget", render: (value) => `¥ ${money.format(value)}` },
    { title: "交付进度", dataIndex: "progress", render: (value) => <div className={styles.progressCell}><Progress percent={value} strokeColor="#5b5ce2" /></div> },
    { title: "状态", dataIndex: "status", render: (value) => <Tag color={toneForStatus(value)}>{value}</Tag> },
    { title: "截止日期", dataIndex: "deadline" },
    { title: "操作", render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];
  return (
    <>
      <PageHeading eyebrow="PROJECT DELIVERY" title="项目交付" description="从立项、里程碑到风险与交付，让项目执行始终透明。" actions={<><Button>项目模板</Button><Button type="primary" icon={<PlusOutlined />}>新建项目</Button></>} />
      <Row gutter={[16, 16]} className={styles.statRow}>
        {[[28, "在执行项目", "blue"], [6, "本月交付", "green"], [3, "风险项目", "red"], [86, "平均按时率", "purple"]].map(([value, label, color]) => <Col xs={12} lg={6} key={String(label)}><Card><Statistic title={label} value={value} suffix={label === "平均按时率" ? "%" : "个"} valueStyle={{ color: color === "red" ? "#ef5b66" : undefined }} /></Card></Col>)}
      </Row>
      <Card className={styles.tableCard}>
        <Toolbar placeholder="搜索项目、客户或负责人" onSearch={setQuery}><Segmented value={view} onChange={(value) => setView(String(value))} options={[{ label: "列表", value: "列表", icon: <TableOutlined /> }, { label: "看板", value: "看板", icon: <AppstoreOutlined /> }]} /></Toolbar>
        {view === "列表" ? <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 6 }} scroll={{ x: 980 }} /> :
          <div className={styles.kanban}>{["规划中", "进行中", "风险", "已完成"].map((status) => <div key={status}><h3>{status}<Tag>{filtered.filter((item) => item.status === status).length}</Tag></h3>{filtered.filter((item) => item.status === status).map((item) => <Card key={item.id} size="small"><strong>{item.name}</strong><small>{item.customer}</small><Progress percent={item.progress} size="small" /><span>{item.owner} · {item.deadline}</span></Card>)}</div>)}</div>}
      </Card>
    </>
  );
}

export function ContractsView() {
  const [items] = useState(initialContracts);
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => `${item.name}${item.customer}${item.number}`.includes(query));
  const columns: ColumnsType<Contract> = [
    { title: "合同名称", dataIndex: "name", render: (value, record) => <div><strong>{value}</strong><small className={styles.block}>{record.number}</small></div> },
    { title: "客户", dataIndex: "customer" },
    { title: "负责人", dataIndex: "owner" },
    { title: "合同金额", dataIndex: "amount", render: (value) => <strong>¥ {money.format(value)}</strong> },
    { title: "回款进度", render: (_, record) => <div className={styles.progressCell}><Progress percent={Math.round(record.collected / record.amount * 100)} strokeColor="#10a779" /><small>已回款 ¥ {money.format(record.collected)}</small></div> },
    { title: "状态", dataIndex: "status", render: (value) => <Tag color={toneForStatus(value)}>{value}</Tag> },
    { title: "到期日期", dataIndex: "expiresAt" },
    { title: "操作", render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];
  return (
    <>
      <PageHeading eyebrow="CONTRACT & CASH" title="合同与回款" description="统一合同台账、回款计划、收款记录和到期风险。" actions={<><Button icon={<ExportOutlined />}>导出合同</Button><Button type="primary" icon={<PlusOutlined />}>新建合同</Button></>} />
      <Row gutter={[16, 16]} className={styles.statRow}>
        <Col xs={12} lg={6}><Card><Statistic title="合同总额" value={12.68} suffix="百万元" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="已回款" value={9.84} suffix="百万元" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="待回款" value={2.84} suffix="百万元" /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="逾期风险" value={3} suffix="项" valueStyle={{ color: "#ef5b66" }} /></Card></Col>
      </Row>
      <Card className={styles.tableCard}>
        <Toolbar placeholder="搜索合同名称、编号或客户" onSearch={setQuery}><Button icon={<DownloadOutlined />}>回款报表</Button></Toolbar>
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 6 }} scroll={{ x: 1050 }} />
      </Card>
    </>
  );
}

export function FilesView() {
  const [items, setItems] = useState(initialFiles);
  const [query, setQuery] = useState("");
  const filtered = items.filter((item) => `${item.name}${item.owner}${item.relatedTo}`.includes(query));
  const columns: ColumnsType<FileItem> = [
    { title: "文件名称", dataIndex: "name", render: (value, record) => <div className={styles.fileName}><span><FileOutlined /></span><div><strong>{value}</strong><small>{record.type} · {record.size}</small></div></div> },
    { title: "关联业务", dataIndex: "relatedTo" },
    { title: "所有者", dataIndex: "owner" },
    { title: "更新时间", dataIndex: "updatedAt" },
    { title: "操作", render: (_, record) => <Space><Button type="text" icon={<DownloadOutlined />} /><Button type="text" danger icon={<DeleteOutlined />} onClick={() => setItems((current) => current.filter((item) => item.id !== record.id))} /></Space> },
  ];
  return (
    <>
      <PageHeading eyebrow="DIGITAL ASSETS" title="文件资产" description="安全管理企业文件，并与客户、项目和合同建立关联。" actions={<><Button>新建文件夹</Button><Button type="primary" icon={<CloudUploadOutlined />}>上传文件</Button></>} />
      <div className={styles.storageHero}>
        <div><CloudUploadOutlined /><div><strong>拖拽文件到此处即可上传</strong><span>支持 PDF、Office、图片及压缩包，单文件最大 100 MB</span></div></div>
        <Progress percent={38} strokeColor={{ "0%": "#5b5ce2", "100%": "#18b6d5" }} />
        <small>已使用 38.2 GB / 100 GB</small>
      </div>
      <Card className={styles.tableCard}>
        <Toolbar placeholder="搜索文件、所有者或关联业务" onSearch={setQuery} />
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 6 }} />
      </Card>
    </>
  );
}

export function ApprovalsView() {
  const [items, setItems] = useState(initialApprovals);
  const update = (id: string, status: Approval["status"]) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status, step: "已结束" } : item));
    message.success(status === "已通过" ? "审批已通过" : "审批已驳回");
  };
  const columns: ColumnsType<Approval> = [
    { title: "审批事项", dataIndex: "title", render: (value, record) => <div><strong>{value}</strong><small className={styles.block}>{record.id}</small></div> },
    { title: "类型", dataIndex: "type", render: (value) => <Tag>{value}</Tag> },
    { title: "申请人", dataIndex: "applicant" },
    { title: "金额", dataIndex: "amount", render: (value) => value ? `¥ ${money.format(value)}` : "-" },
    { title: "当前节点", dataIndex: "step" },
    { title: "提交时间", dataIndex: "submittedAt" },
    { title: "状态", dataIndex: "status", render: (value) => <Tag color={toneForStatus(value)}>{value}</Tag> },
    { title: "操作", render: (_, record) => record.status === "待审批" ? <Space><Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => update(record.id, "已通过")}>通过</Button><Button size="small" danger onClick={() => update(record.id, "已驳回")}>驳回</Button></Space> : <Button type="link">查看</Button> },
  ];
  return (
    <>
      <PageHeading eyebrow="WORKFLOW" title="审批流程" description="集中处理合同、采购、费用与项目变更等企业流程。" actions={<Button type="primary" icon={<SendOutlined />}>发起审批</Button>} />
      <Row gutter={[16, 16]} className={styles.statRow}>
        <Col xs={12} lg={6}><Card><Statistic title="我的待办" value={12} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="我发起的" value={8} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="本月已通过" value={46} /></Card></Col>
        <Col xs={12} lg={6}><Card><Statistic title="平均处理时长" value={3.2} suffix="小时" /></Card></Col>
      </Row>
      <Card className={styles.tableCard}>
        <Tabs items={[{ key: "todo", label: "待我审批" }, { key: "mine", label: "我发起的" }, { key: "done", label: "已处理" }]} />
        <Table rowKey="id" columns={columns} dataSource={items} pagination={false} scroll={{ x: 980 }} />
      </Card>
    </>
  );
}

export function SystemView() {
  const permissionColumns: ColumnsType<{ key: string; module: string; admin: boolean; manager: boolean; staff: boolean; auditor: boolean }> = [
    { title: "功能模块", dataIndex: "module" },
    ...(["admin", "manager", "staff", "auditor"] as const).map((key, index) => ({ title: ["超级管理员", "部门负责人", "普通员工", "审计查看者"][index], dataIndex: key, align: "center" as const, render: (value: boolean) => value ? <CheckOutlined className={styles.check} /> : <span className={styles.noAccess}>—</span> })),
  ];
  const permissions = [
    { key: "1", module: "经营数据看板", admin: true, manager: true, staff: true, auditor: true },
    { key: "2", module: "组织与成员管理", admin: true, manager: true, staff: false, auditor: false },
    { key: "3", module: "客户数据管理", admin: true, manager: true, staff: true, auditor: true },
    { key: "4", module: "合同与回款", admin: true, manager: true, staff: false, auditor: true },
    { key: "5", module: "角色与权限", admin: true, manager: false, staff: false, auditor: false },
  ];
  return (
    <>
      <PageHeading eyebrow="ADMINISTRATION" title="系统管理" description="配置角色权限、企业参数、安全策略与审计追踪。" actions={<Button type="primary">保存设置</Button>} />
      <div className={styles.systemGrid}>
        <Card title="企业设置">
          <Form layout="vertical" initialValues={{ name: "启衡科技（上海）有限公司", code: "NEXUS-SH-001", timezone: "Asia/Shanghai" }}>
            <Form.Item name="name" label="企业名称"><Input /></Form.Item>
            <Form.Item name="code" label="企业编码"><Input /></Form.Item>
            <Form.Item name="timezone" label="默认时区"><Select options={[{ value: "Asia/Shanghai", label: "中国标准时间（UTC+8）" }]} /></Form.Item>
            <Button type="primary">更新企业信息</Button>
          </Form>
        </Card>
        <Card title="安全状态">
          <List dataSource={[
            ["密码策略", "已启用强密码策略", "正常"],
            ["登录保护", "连续失败 5 次后锁定", "正常"],
            ["会话时长", "8 小时后自动过期", "正常"],
            ["双重验证", "3/6 位管理员已启用", "待完善"],
          ]} renderItem={(item) => <List.Item extra={<Tag color={item[2] === "正常" ? "green" : "orange"}>{item[2]}</Tag>}><List.Item.Meta avatar={<Avatar icon={<SafetyCertificateOutlined />} />} title={item[0]} description={item[1]} /></List.Item>} />
        </Card>
      </div>
      <Card title="角色权限矩阵" className={styles.tableCard}><Table columns={permissionColumns} dataSource={permissions} pagination={false} /></Card>
      <Card title="最近操作日志" className={styles.tableCard}>
        <Timeline items={[
          { color: "green", children: "李明远 更新了角色「部门负责人」的数据权限 · 10:42" },
          { color: "blue", children: "张磊 新建客户「上海智联科技有限公司」· 09:20" },
          { color: "blue", children: "王磊 导出合同回款报表 · 昨天 18:03" },
          { color: "orange", children: "系统检测到新的管理员登录设备 · 昨天 16:48" },
        ]} />
      </Card>
    </>
  );
}
