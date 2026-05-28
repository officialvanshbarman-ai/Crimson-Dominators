import { NextResponse } from "next/server";
import { getErrorMessage, jsonError } from "@/lib/api";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { validateJoinPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const validation = validateJoinPayload(payload);

  if (!validation.ok) {
    return jsonError(validation.error);
  }

  if (!isSupabaseConfigured()) {
    return jsonError("The join form database is not configured yet.", 503);
  }

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("join_submissions").insert(validation.data);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Your request was submitted successfully." },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(getErrorMessage(error, "Unable to submit the form."), 500);
  }
}
