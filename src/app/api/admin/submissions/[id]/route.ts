import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("join_submissions").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}
