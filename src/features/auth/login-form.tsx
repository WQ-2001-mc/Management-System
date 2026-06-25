"use client";

import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "./login.module.css";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const result = (await response.json()) as { error?: string };
      setError(result.error ?? "登录失败，请稍后重试。");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
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
