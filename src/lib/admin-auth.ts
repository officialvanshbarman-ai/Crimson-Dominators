import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "crimson_admin_session";

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function getAdminConfig() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET || password;

  if (!password || !secret) {
    throw new Error("Admin credentials are not configured.");
  }

  return { username, password, secret };
}

function base64Url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminCredentials(username: string, password: string) {
  const config = getAdminConfig();
  return username === config.username && password === config.password;
}

export function createAdminSession(username: string) {
  const { secret } = getAdminConfig();
  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + 1000 * 60 * 60 * 12,
  };
  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return null;
  }

  const { secret } = getAdminConfig();
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !safeEqual(sign(encodedPayload, secret), signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString()) as SessionPayload;

    if (!payload.username || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return verifyAdminSessionToken(sessionToken);
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    throw new Error("Unauthorized");
  }

  return admin;
}

export function getAdminCookieOptions(maxAge = 60 * 60 * 12) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
