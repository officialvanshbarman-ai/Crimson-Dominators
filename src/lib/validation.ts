import type { GalleryImage, SiteSettings } from "@/lib/defaults";

type ValidationResult<T> = { ok: true; data: T } | { ok: false; error: string };

type JoinPayload = {
  name: string;
  class_name: string;
  phone: string;
  message: string;
};

type SettingsPayload = Omit<SiteSettings, "updated_at">;

type GalleryPayload = Omit<GalleryImage, "id" | "created_at">;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const readCount = (value: unknown) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? Math.round(numberValue) : null;
};

export function validateJoinPayload(payload: unknown): ValidationResult<JoinPayload> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid form data." };
  }

  const name = cleanText(payload.name, 80);
  const className = cleanText(payload.className ?? payload.class_name, 40);
  const phone = cleanText(payload.phone, 30);
  const message = cleanText(payload.message, 600);

  if (name.length < 2) {
    return { ok: false, error: "Please enter a valid name." };
  }

  if (className.length < 1) {
    return { ok: false, error: "Please enter your class." };
  }

  if (!/^[0-9+\-() ]{6,30}$/.test(phone)) {
    return { ok: false, error: "Please enter a valid phone number." };
  }

  if (message.length < 5) {
    return { ok: false, error: "Please add a short message." };
  }

  return {
    ok: true,
    data: {
      name,
      class_name: className,
      phone,
      message,
    },
  };
}

export function validateSettingsPayload(payload: unknown): ValidationResult<SettingsPayload> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid settings data." };
  }

  const membersCount = readCount(payload.members_count);
  const peopleHelpedCount = readCount(payload.people_helped_count);
  const eventsDoneCount = readCount(payload.events_done_count);
  const activeSupportersCount = readCount(payload.active_supporters_count);

  const data = {
    id: "main",
    website_title: cleanText(payload.website_title, 80),
    website_subtitle: cleanText(payload.website_subtitle, 180),
    about_text: cleanText(payload.about_text, 600),
    mission_text: cleanText(payload.mission_text, 600),
    members_count: membersCount,
    people_helped_count: peopleHelpedCount,
    events_done_count: eventsDoneCount,
    active_supporters_count: activeSupportersCount,
  };

  if (!data.website_title || !data.website_subtitle || !data.about_text || !data.mission_text) {
    return { ok: false, error: "Title, subtitle, about text, and mission text are required." };
  }

  if (
    data.members_count === null ||
    data.people_helped_count === null ||
    data.events_done_count === null ||
    data.active_supporters_count === null
  ) {
    return { ok: false, error: "Counters must be zero or higher." };
  }

  return {
    ok: true,
    data: data as SettingsPayload,
  };
}

export function validateGalleryPayload(payload: unknown): ValidationResult<GalleryPayload> {
  if (!isRecord(payload)) {
    return { ok: false, error: "Invalid gallery data." };
  }

  const title = cleanText(payload.title, 80);
  const imageUrl = cleanText(payload.image_url, 600);
  const altText = cleanText(payload.alt_text, 140);
  const sortOrder = readCount(payload.sort_order) ?? 0;
  const isVisible = typeof payload.is_visible === "boolean" ? payload.is_visible : true;

  if (!title) {
    return { ok: false, error: "Gallery title is required." };
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return { ok: false, error: "Gallery image URL must be a valid URL." };
    }
  }

  return {
    ok: true,
    data: {
      title,
      image_url: imageUrl || null,
      alt_text: altText || title,
      sort_order: sortOrder,
      is_visible: isVisible,
    },
  };
}
