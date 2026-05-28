import {
  DEFAULT_SETTINGS,
  GALLERY_PLACEHOLDERS,
  normalizeGallery,
  normalizeSiteSettings,
  type GalleryImage,
  type JoinSubmission,
  type SiteSettings,
} from "@/lib/defaults";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export type SiteData = {
  settings: SiteSettings;
  gallery: GalleryImage[];
  databaseReady: boolean;
  error: string | null;
};

export type AdminContent = {
  settings: SiteSettings;
  gallery: GalleryImage[];
  submissions: JoinSubmission[];
};

export async function getPublicSiteData(): Promise<SiteData> {
  if (!isSupabaseConfigured()) {
    return {
      settings: DEFAULT_SETTINGS,
      gallery: GALLERY_PLACEHOLDERS,
      databaseReady: false,
      error: "Supabase is not configured yet.",
    };
  }

  try {
    const supabase = getSupabaseAdmin();
    const [settingsResult, galleryResult] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
      supabase
        .from("gallery_images")
        .select("*")
        .eq("is_visible", true)
        .order("sort_order", { ascending: true }),
    ]);

    const gallery = normalizeGallery((galleryResult.data as GalleryImage[] | null) ?? null);

    return {
      settings: normalizeSiteSettings(settingsResult.data as Partial<SiteSettings> | null),
      gallery: gallery.length > 0 ? gallery : GALLERY_PLACEHOLDERS,
      databaseReady: !settingsResult.error && !galleryResult.error,
      error: settingsResult.error?.message ?? galleryResult.error?.message ?? null,
    };
  } catch (error) {
    return {
      settings: DEFAULT_SETTINGS,
      gallery: GALLERY_PLACEHOLDERS,
      databaseReady: false,
      error: error instanceof Error ? error.message : "Unable to load site data.",
    };
  }
}

export async function getAdminContent(): Promise<AdminContent> {
  const supabase = getSupabaseAdmin();
  const [settingsResult, galleryResult, submissionsResult] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", "main").maybeSingle(),
    supabase.from("gallery_images").select("*").order("sort_order", { ascending: true }),
    supabase.from("join_submissions").select("*").order("created_at", { ascending: false }),
  ]);

  if (settingsResult.error) {
    throw new Error(settingsResult.error.message);
  }

  if (galleryResult.error) {
    throw new Error(galleryResult.error.message);
  }

  if (submissionsResult.error) {
    throw new Error(submissionsResult.error.message);
  }

  return {
    settings: normalizeSiteSettings(settingsResult.data as Partial<SiteSettings> | null),
    gallery: ((galleryResult.data as GalleryImage[] | null) ?? []).sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    submissions: ((submissionsResult.data as JoinSubmission[] | null) ?? []) as JoinSubmission[],
  };
}
