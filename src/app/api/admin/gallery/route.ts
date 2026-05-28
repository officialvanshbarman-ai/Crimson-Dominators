import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";
import type { GalleryImage } from "@/lib/defaults";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validateGalleryPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const payload = await request.json().catch(() => null);
    const validation = validateGalleryPayload(payload);

    if (!validation.ok) {
      return jsonError(validation.error);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_images")
      .insert(validation.data)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ image: data as GalleryImage }, { status: 201 });
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}
