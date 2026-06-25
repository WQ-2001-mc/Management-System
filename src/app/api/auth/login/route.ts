import { NextResponse } from "next/server";
import { z } from "zod";

import { validateDemoLogin } from "@/lib/demo-session";
import { createSessionToken } from "@/server/auth/session";
import { sessionCookieName } from "@/server/auth/current-session";

const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const parsed = loginInput.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "登录信息格式不正确" }, { status: 400 });
  const user = validateDemoLogin(parsed.data.email, parsed.data.password);
  if (!user) return NextResponse.json({ error: "邮箱或密码不正确" }, { status: 401 });

  const token = createSessionToken(
    { email: user.email, role: user.role },
    process.env.SESSION_SECRET ?? "local-development-only-secret",
  );
  const response = NextResponse.json({ user });
  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

