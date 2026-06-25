"use client";

import {
  AlertOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  DollarOutlined,
  MoreOutlined,
  ProjectOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Button, Progress, Segmented, Tag } from "antd";
import type { EChartsOption } from "echarts";
import Link from "next/link";
import { useMemo, useState } from "react";

import { EChart } from "@/components/charts/echart";
import { approvals, contracts, projects, trendData } from "@/lib/demo-data";

import styles from "./dashboard.module.css";

const money = new Intl.NumberFormat("zh-CN");

const kpis = [
  { label: "本月营业收入", value: "2,450,000", unit: "元", change: "18.6%", icon: DollarOutlined, tone: "indigo", spark: [4, 6, 5, 8, 7, 10] },
  { label: "本月回款金额", value: "1,890,000", unit: "元", change: "15.3%", icon: RiseOutlined, tone: "cyan", spark: [3, 4, 4, 6, 5, 8] },
  { label: "在执行项目", value: "28", unit: "个", change: "7.7%", icon: ProjectOutlined, tone: "green", spark: [4, 3, 6, 5, 7, 8] },
  { label: "新增客户数", value: "46", unit: "个", change: "27.8%", icon: CustomerServiceOutlined, tone: "orange", spark: [2, 4, 3, 6, 7, 9] },
];

const warnings = [
  { title: "合同回款延迟", detail: "涉及金额 420,000 元", count: "3 项", tone: "red" },
  { title: "项目进度滞后", detail: "较计划平均滞后 8 天", count: "2 项", tone: "orange" },
  { title: "即将到期合同", detail: "30 日内到期", count: "5 项", tone: "orange" },
  { title: "预算超支项目", detail: "最高超支 12%", count: "1 项", tone: "orange" },
];

export function DashboardView() {
  const [period, setPeriod] = useState("月");

  const trendOption = useMemo<EChartsOption>(() => ({
    animationDuration: 700,
    color: ["#5b5ce2", "#18b6d5"],
    tooltip: { trigger: "axis", backgroundColor: "#171a2b", borderWidth: 0, textStyle: { color: "#fff" } },
    grid: { left: 12, right: 16, top: 28, bottom: 10, containLabel: true },
    xAxis: { type: "category", data: trendData.map((item) => item.month), boundaryGap: false, axisLine: { lineStyle: { color: "#e8eaf1" } }, axisTick: { show: false }, axisLabel: { color: "#8a91a5" } },
    yAxis: { type: "value", axisLabel: { formatter: "{value}万", color: "#8a91a5" }, splitLine: { lineStyle: { color: "#eef0f5", type: "dashed" } } },
    series: [
      { name: "营业收入", type: "line", smooth: true, symbolSize: 7, data: trendData.map((item) => item.revenue), lineStyle: { width: 3 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(91,92,226,.20)" }, { offset: 1, color: "rgba(91,92,226,0)" }] } } },
      { name: "回款金额", type: "line", smooth: true, symbolSize: 7, data: trendData.map((item) => item.collection), lineStyle: { width: 3 } },
    ],
  }), []);

  const customerOption = useMemo<EChartsOption>(() => ({
    color: ["#5b5ce2", "#16b6d5", "#10a779", "#f5a524", "#ef6b72"],
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", right: 4, top: "center", icon: "circle", textStyle: { color: "#70778c" } },
    series: [{ type: "pie", radius: ["54%", "76%"], center: ["32%", "50%"], avoidLabelOverlap: true, label: { show: false }, data: [
      { value: 102, name: "华东地区" }, { value: 56, name: "华北地区" }, { value: 38, name: "华南地区" }, { value: 22, name: "华中地区" }, { value: 18, name: "西部地区" },
    ] }],
    graphic: [{ type: "text", left: "24%", top: "42%", style: { text: "236\n客户总数", textAlign: "center", fill: "#171a2b", fontSize: 15, fontWeight: 700, lineHeight: 24 } }],
  }), []);

  return (
    <div className={styles.page}>
      <section className={styles.pageHeader}>
        <div>
          <p className={styles.eyebrow}>BUSINESS COMMAND CENTER</p>
          <h1>早上好，李明远 <span>👋</span></h1>
          <p><span className={styles.liveDot} />业务运行良好 · 数据于今日 8:00 更新</p>
        </div>
        <div className={styles.headerTools}>
          <Button icon={<CalendarOutlined />}>本月（6.1 - 6.30）</Button>
          <Button>自定义看板</Button>
        </div>
      </section>

      <section className={styles.kpiGrid}>
        {kpis.map((item) => {
          const Icon = item.icon;
          return (
            <article className={styles.kpi} key={item.label}>
              <div className={`${styles.kpiIcon} ${styles[item.tone]}`}><Icon /></div>
              <div className={styles.kpiBody}>
                <span>{item.label}（{item.unit}）</span>
                <strong>{item.value}</strong>
                <small>较上月 <em><ArrowUpOutlined /> {item.change}</em></small>
              </div>
              <div className={styles.sparkline}>
                {item.spark.map((value, index) => <i key={index} style={{ height: `${value * 3}px` }} />)}
              </div>
            </article>
          );
        })}
      </section>

      <div className={styles.topGrid}>
        <article className={`${styles.panel} ${styles.trendPanel}`}>
          <div className={styles.panelHeader}>
            <div>
              <h2>营收与回款趋势</h2>
              <p><span className={styles.legendIndigo} />营业收入（万元） <span className={styles.legendCyan} />回款金额（万元）</p>
            </div>
            <Segmented options={["日", "周", "月"]} value={period} onChange={(value) => setPeriod(String(value))} />
          </div>
          <EChart option={trendOption} height={285} />
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}><h2>目标达成</h2><Button type="text" icon={<MoreOutlined />} /></div>
          <div className={styles.goalContent}>
            <Progress type="dashboard" percent={72} size={176} strokeColor={{ "0%": "#6869f1", "100%": "#25bad7" }} railColor="#eef0f6" format={(percent) => <span className={styles.goalPercent}>{percent}%<small>年度营收目标</small></span>} />
            <div className={styles.goalBars}>
              {[["营收目标", 72, "24,500,000", "#5b5ce2"], ["回款目标", 65, "18,000,000", "#18b6d5"], ["利润目标", 58, "6,200,000", "#10a779"]].map(([label, value, total, color]) => (
                <div key={String(label)}>
                  <div><span>{label}</span><strong>{total}</strong></div>
                  <Progress percent={Number(value)} showInfo={false} strokeColor={String(color)} railColor="#eef0f5" />
                </div>
              ))}
            </div>
          </div>
        </article>

        <aside className={`${styles.panel} ${styles.riskPanel}`}>
          <div className={styles.panelHeader}><h2>风险预警</h2><Link href="/analytics">全部 ›</Link></div>
          <div className={styles.riskList}>
            {warnings.map((item) => (
              <div key={item.title}>
                <span className={`${styles.riskDot} ${styles[item.tone]}`}><AlertOutlined /></span>
                <div><strong>{item.title}</strong><small>{item.detail}</small></div>
                <b>{item.count}</b>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className={styles.middleGrid}>
        <article className={`${styles.panel} ${styles.operations}`}>
          <div className={styles.panelHeader}>
            <div className={styles.tabs}><h2>项目与合同运营</h2><button className={styles.selectedTab}>全部项目</button><button>在执行</button><button>已完成</button></div>
            <Link href="/projects">查看全部项目 ›</Link>
          </div>
          <div className={styles.tableWrap}>
            <table>
              <thead><tr><th>项目 / 合同名称</th><th>客户名称</th><th>负责人</th><th>进度</th><th>合同金额</th><th>回款进度</th><th>状态</th><th>结束日期</th></tr></thead>
              <tbody>
                {projects.slice(0, 4).map((project, index) => {
                  const contract = contracts[index];
                  const tone = project.status === "风险" ? "orange" : project.status === "已完成" ? "green" : "blue";
                  return (
                    <tr key={project.id}>
                      <td><span className={styles.rowDot} /> <strong>{project.name}</strong><small>{project.id}</small></td>
                      <td>{project.customer}</td>
                      <td><span className={styles.avatar}>{project.owner.slice(-1)}</span>{project.owner}</td>
                      <td><Progress percent={project.progress} size="small" showInfo={false} /><small>{project.progress}%</small></td>
                      <td>¥ {money.format(contract?.amount ?? project.budget)}</td>
                      <td>{contract ? Math.round(contract.collected / contract.amount * 100) : 0}%</td>
                      <td><Tag color={tone}>{project.status}</Tag></td>
                      <td>{project.deadline}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <aside className={`${styles.panel} ${styles.approvalPanel}`}>
          <div className={styles.panelHeader}><h2>待办审批 <span>(12)</span></h2><Link href="/approvals">全部 ›</Link></div>
          {approvals.slice(0, 3).map((item) => (
            <Link className={styles.approvalItem} href="/approvals" key={item.id}>
              <span className={styles.approvalIcon}><ClockCircleOutlined /></span>
              <div><strong>{item.title}</strong><small>{item.applicant} 提交 · {item.submittedAt}</small></div>
            </Link>
          ))}
          <Link className={styles.allLink} href="/approvals">查看全部待办</Link>
        </aside>
      </div>

      <div className={styles.bottomGrid}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}><h2>客户分布</h2><Link href="/customers">客户中心 ›</Link></div>
          <EChart option={customerOption} height={220} />
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}><h2>业务健康度</h2><span className={styles.healthBadge}>综合 82 · 健康</span></div>
          <div className={styles.healthList}>
            {[["财务健康度", 85, "#10a779", "健康"], ["项目交付健康度", 72, "#18b6d5", "良好"], ["客户满意度", 90, "#5b5ce2", "优秀"], ["内部运营效率", 68, "#f5a524", "良好"]].map(([label, value, color, status]) => (
              <div key={String(label)}><span>{label}</span><Progress percent={Number(value)} showInfo={false} strokeColor={String(color)} /><strong>{value}</strong><em>{status}</em></div>
            ))}
          </div>
        </article>
        <article className={styles.panel}>
          <div className={styles.panelHeader}><h2>最近动态</h2><Link href="/system">审计日志 ›</Link></div>
          <div className={styles.activityList}>
            <div><CheckCircleFilled /><p>合同「智慧园区平台建设项目」已回款 <strong>+ ¥120,000</strong><small>今天 10:30</small></p></div>
            <div><ProjectOutlined /><p>项目「移动端应用开发」进度更新至 80%<small>今天 09:45</small></p></div>
            <div><CustomerServiceOutlined /><p>新客户「上海智联科技有限公司」已创建<small>今天 09:20</small></p></div>
          </div>
        </article>
      </div>
    </div>
  );
}
