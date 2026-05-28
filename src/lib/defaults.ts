export type SiteSettings = {
  id: string;
  website_title: string;
  website_subtitle: string;
  about_text: string;
  mission_text: string;
  members_count: number;
  people_helped_count: number;
  events_done_count: number;
  active_supporters_count: number;
  updated_at?: string | null;
};

export type GalleryImage = {
  id: string;
  title: string;
  image_url: string | null;
  alt_text: string;
  sort_order: number;
  is_visible: boolean;
  created_at?: string | null;
};

export type JoinSubmission = {
  id: string;
  name: string;
  class_name: string;
  phone: string;
  message: string;
  created_at: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "main",
  website_title: "Crimson Dominators",
  website_subtitle: "United by loyalty. Driven by ambition. Built to dominate.",
  about_text:
    "Crimson Dominators is a school brotherhood built on respect, unity, discipline, friendship, and ambition.",
  mission_text:
    "We stand for loyalty, respect, personal growth, helping people, and no drama, only unity.",
  members_count: 42,
  people_helped_count: 120,
  events_done_count: 8,
  active_supporters_count: 25,
  updated_at: null,
};

export const GALLERY_PLACEHOLDERS: GalleryImage[] = [
  {
    id: "placeholder-1",
    title: "Squad Moment",
    image_url: null,
    alt_text: "Photo placeholder for Crimson Dominators",
    sort_order: 1,
    is_visible: true,
  },
  {
    id: "placeholder-2",
    title: "School Event",
    image_url: null,
    alt_text: "Photo placeholder for a school event",
    sort_order: 2,
    is_visible: true,
  },
  {
    id: "placeholder-3",
    title: "Helping Hands",
    image_url: null,
    alt_text: "Photo placeholder for group support",
    sort_order: 3,
    is_visible: true,
  },
  {
    id: "placeholder-4",
    title: "Brotherhood",
    image_url: null,
    alt_text: "Photo placeholder for brotherhood",
    sort_order: 4,
    is_visible: true,
  },
];

const toCount = (value: unknown, fallback: number) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0
    ? Math.round(numberValue)
    : fallback;
};

const toText = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

export function normalizeSiteSettings(row: Partial<SiteSettings> | null | undefined): SiteSettings {
  if (!row) {
    return DEFAULT_SETTINGS;
  }

  return {
    id: toText(row.id, DEFAULT_SETTINGS.id),
    website_title: toText(row.website_title, DEFAULT_SETTINGS.website_title),
    website_subtitle: toText(row.website_subtitle, DEFAULT_SETTINGS.website_subtitle),
    about_text: toText(row.about_text, DEFAULT_SETTINGS.about_text),
    mission_text: toText(row.mission_text, DEFAULT_SETTINGS.mission_text),
    members_count: toCount(row.members_count, DEFAULT_SETTINGS.members_count),
    people_helped_count: toCount(row.people_helped_count, DEFAULT_SETTINGS.people_helped_count),
    events_done_count: toCount(row.events_done_count, DEFAULT_SETTINGS.events_done_count),
    active_supporters_count: toCount(
      row.active_supporters_count,
      DEFAULT_SETTINGS.active_supporters_count,
    ),
    updated_at: row.updated_at ?? null,
  };
}

export function normalizeGallery(rows: GalleryImage[] | null | undefined) {
  return (rows ?? [])
    .filter((item) => item.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);
}
