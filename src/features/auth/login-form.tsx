"use client";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { validateDemoLogin } from "@/lib/demo-session";

import styles from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 450));
    const user = validateDemoLogin(values.email, values.password);
    if (!user) {
      setError("邮箱或密码不正确，请使用页面中的演示账户。");
      setLoading(false);
      return;
    }
    document.cookie = `nexus-demo-session=${encodeURIComponent(user.email)}; Path=/; SameSite=Lax`;
    router.push("/dashboard");
  };

  return (
    <Form
      layout="vertical"
      initialValues={{ email: "admin@nexus.local", password: "Nexus@2026", remember: true }}
      onFinish={submit}
      requiredMark={false}
    >
      {error && <Alert className={styles.alert} type="error" showIcon message={error} />}
      <Form.Item name="email" label="工作邮箱" rules={[{ required: true }, { type: "email" }]}>
        <Input size="large" prefix={<MailOutlined />} />
      </Form.Item>
      <Form.Item name="password" label="登录密码" rules={[{ required: true }]}>
        <Input.Password size="large" prefix={<LockOutlined />} />
      </Form.Item>
      <div className={styles.formMeta}>
        <Form.Item name="remember" valuePropName="checked" noStyle><Checkbox>保持登录</Checkbox></Form.Item>
        <button type="button">忘记密码？</button>
      </div>
      <Button className={styles.submit} type="primary" htmlType="submit" size="large" block loading={loading}>
        登录企业工作台
      </Button>
    </Form>
  );
}

