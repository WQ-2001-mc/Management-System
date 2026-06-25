import { LoginForm } from "@/features/auth/login-form";

import styles from "@/features/auth/login.module.css";

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.visual}>
        <div className={styles.brand}>
          <span className={styles.mark}>N</span>
          <span><strong>NEXUS</strong><small>企业数据平台</small></span>
        </div>
        <div className={styles.visualCopy}>
          <span>ONE PLATFORM. EVERY DECISION.</span>
          <h1>让企业数据真正驱动每一次决策。</h1>
          <p>统一连接组织、客户、项目、合同与经营指标，为成长型企业提供清晰、敏捷、可信赖的数字化工作方式。</p>
          <div className={styles.visualStats}>
            <div><strong>9</strong><small>核心业务模块</small></div>
            <div><strong>99.9%</strong><small>数据可用性目标</small></div>
            <div><strong>360°</strong><small>企业经营视图</small></div>
          </div>
        </div>
        <div className={styles.visualFooter}>© 2026 NEXUS Enterprise OS · Secure by design</div>
      </section>
      <section className={styles.formSide}>
        <div className={styles.formCard}>
          <span>WELCOME BACK</span>
          <h2>欢迎回来</h2>
          <p>登录后继续管理你的企业数据与业务流程。</p>
          <LoginForm />
          <div className={styles.demo}><strong>演示管理员</strong><br />admin@nexus.local · Nexus@2026</div>
        </div>
      </section>
    </main>
  );
}
