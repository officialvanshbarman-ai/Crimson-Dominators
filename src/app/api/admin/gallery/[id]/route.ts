import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";
import type { GalleryImage } from "@/lib/defaults";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validateGalleryPayload } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const payload = await request.json().catch(() => null);
    const validation = validateGalleryPayload(payload);

    if (!validation.ok) {
      return jsonError(validation.error);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("gallery_images")
      .update(validation.data)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ image: data as GalleryImage });
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();

    const { id } = await context.params;
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}
