import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";
import { getAdminContent } from "@/lib/site-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const content = await getAdminContent();

    return NextResponse.json(content);
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}
