import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    return NextResponse.json({
      authenticated: Boolean(admin),
      username: admin?.username ?? null,
    });
  } catch {
    return NextResponse.json({ authenticated: false, username: null });
  }
}
