import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSession,
  getAdminCookieOptions,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload !== "object" ||
    !("username" in payload) ||
    !("password" in payload)
  ) {
    return jsonError("Username and password are required.");
  }

  const username = String(payload.username).trim();
  const password = String(payload.password);

  try {
    if (!verifyAdminCredentials(username, password)) {
      return jsonError("Invalid admin login.", 401);
    }

    const response = NextResponse.json({ authenticated: true, username });
    response.cookies.set(ADMIN_COOKIE_NAME, createAdminSession(username), getAdminCookieOptions());

    return response;
  } catch (error) {
    return jsonError(getErrorMessage(error, "Admin login is not configured."), 500);
  }
}
