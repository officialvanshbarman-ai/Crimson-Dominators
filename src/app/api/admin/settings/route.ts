import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { getErrorMessage, jsonError } from "@/lib/api";
import { normalizeSiteSettings, type SiteSettings } from "@/lib/defaults";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validateSettingsPayload } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    await requireAdmin();

    const payload = await request.json().catch(() => null);
    const validation = validateSettingsPayload(payload);

    if (!validation.ok) {
      return jsonError(validation.error);
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("site_settings")
      .upsert(
        {
          ...validation.data,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      settings: normalizeSiteSettings(data as Partial<SiteSettings>),
    });
  } catch (error) {
    const message = getErrorMessage(error);
    return jsonError(message, message === "Unauthorized" ? 401 : 500);
  }
}
