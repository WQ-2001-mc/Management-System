import { cookies } from "next/headers";

import { verifySessionToken } from "./session";

export const sessionCookieName = "nexus-session";

export async function getCurrentSession() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) return null;
  return verifySessionToken(token, process.env.SESSION_SECRET ?? "local-development-only-secret");
}

