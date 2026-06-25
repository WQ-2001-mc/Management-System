import { createHmac, timingSafeEqual } from "node:crypto";

export interface SessionPayload {
  email: string;
  role: string;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function createSessionToken(payload: SessionPayload, secret: string) {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${sign(encoded, secret)}`;
}

export function verifySessionToken(token: string, secret: string): SessionPayload | null {
  const [encoded, signature, ...rest] = token.split(".");
  if (!encoded || !signature || rest.length > 0) return null;
  const expected = sign(encoded, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<SessionPayload>;
    if (typeof parsed.email !== "string" || typeof parsed.role !== "string") return null;
    return { email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

