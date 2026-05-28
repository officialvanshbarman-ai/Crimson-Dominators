"use client";

import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LockKeyhole,
  LogOut,
  RefreshCcw,
  Save,
  Shield,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS, type GalleryImage, type SiteSettings } from "@/lib/defaults";
import type { AdminContent } from "@/lib/site-data";

type AuthState = "checking" | "login" | "authenticated";

type GalleryDraft = {
  title: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_visible: boolean;
};

const countFields = [
  "members_count",
  "people_helped_count",
  "events_done_count",
  "active_supporters_count",
] as const;

const initialGalleryDraft: GalleryDraft = {
  title: "",
  image_url: "",
  alt_text: "",
  sort_order: 1,
  is_visible: true,
};

export function AdminPanel() {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [content, setContent] = useState<AdminContent | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [draft, setDraft] = useState<GalleryDraft>(initialGalleryDraft);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const submissionCount = content?.submissions.length ?? 0;
  const visibleGalleryCount = useMemo(
    () => content?.gallery.filter((item) => item.is_visible).length ?? 0,
    [content],
  );

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
  };

  const fetchContent = async () => {
    setContentLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const result = (await response.json().catch(() => ({}))) as AdminContent & { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          setAuthState("login");
        }
        throw new Error(result.error || "Unable to load admin data.");
      }

      setContent(result);
      setSettingsForm(result.settings);
      setDraft((current) => ({
        ...current,
        sort_order: result.gallery.length + 1,
      }));
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to load admin data.");
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/admin/session", { cache: "no-store" });
        const result = (await response.json().catch(() => ({}))) as { authenticated?: boolean };

        if (response.ok && result.authenticated) {
          setAuthState("authenticated");
          await fetchContent();
          return;
        }

        setAuthState("login");
      } catch {
        setAuthState("login");
      }
    };

    void checkSession();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginLoading(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to sign in.");
      }

      setPassword("");
      setAuthState("authenticated");
      await fetchContent();
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => null);
    setContent(null);
    setPassword("");
    setAuthState("login");
  };

  const updateSettings = (field: keyof SiteSettings, value: string) => {
    setSettingsForm((current) => ({
      ...current,
      [field]: countFields.includes(field as (typeof countFields)[number])
        ? Math.max(0, Number(value || 0))
        : value,
    }));
  };

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingSettings(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      const result = (await response.json().catch(() => ({}))) as {
        settings?: SiteSettings;
        error?: string;
      };

      if (!response.ok || !result.settings) {
        throw new Error(result.error || "Unable to save settings.");
      }

      const savedSettings = result.settings;
      setSettingsForm(savedSettings);
      setContent((current) => (current ? { ...current, settings: savedSettings } : current));
      showNotice("success", "Website content updated.");
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const deleteSubmission = async (id: string) => {
    setBusyId(id);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete submission.");
      }

      setContent((current) =>
        current
          ? {
              ...current,
              submissions: current.submissions.filter((submission) => submission.id !== id),
            }
          : current,
      );
      showNotice("success", "Submission deleted.");
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to delete submission.");
    } finally {
      setBusyId(null);
    }
  };

  const updateGalleryItem = <K extends keyof GalleryImage>(
    id: string,
    field: K,
    value: GalleryImage[K],
  ) => {
    setContent((current) =>
      current
        ? {
            ...current,
            gallery: current.gallery.map((item) =>
              item.id === id ? { ...item, [field]: value } : item,
            ),
          }
        : current,
    );
  };

  const saveGalleryItem = async (item: GalleryImage) => {
    setBusyId(item.id);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const result = (await response.json().catch(() => ({}))) as {
        image?: GalleryImage;
        error?: string;
      };

      if (!response.ok || !result.image) {
        throw new Error(result.error || "Unable to save gallery item.");
      }

      setContent((current) =>
        current
          ? {
              ...current,
              gallery: current.gallery.map((galleryItem) =>
                galleryItem.id === item.id ? result.image! : galleryItem,
              ),
            }
          : current,
      );
      showNotice("success", "Gallery item saved.");
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to save gallery item.");
    } finally {
      setBusyId(null);
    }
  };

  const addGalleryItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusyId("new-gallery");
    setNotice(null);

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = (await response.json().catch(() => ({}))) as {
        image?: GalleryImage;
        error?: string;
      };

      if (!response.ok || !result.image) {
        throw new Error(result.error || "Unable to add gallery item.");
      }

      setContent((current) =>
        current
          ? {
              ...current,
              gallery: [...current.gallery, result.image!].sort((a, b) => a.sort_order - b.sort_order),
            }
          : current,
      );
      setDraft({ ...initialGalleryDraft, sort_order: (content?.gallery.length ?? 0) + 2 });
      showNotice("success", "Gallery item added.");
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to add gallery item.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setBusyId(id);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete gallery item.");
      }

      setContent((current) =>
        current
          ? {
              ...current,
              gallery: current.gallery.filter((item) => item.id !== id),
            }
          : current,
      );
      showNotice("success", "Gallery item deleted.");
    } catch (error) {
      showNotice("error", error instanceof Error ? error.message : "Unable to delete gallery item.");
    } finally {
      setBusyId(null);
    }
  };

  if (authState === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffafa] text-[#12070a]">
        <div className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.24em] text-[#b00020]">
          <Loader2 className="animate-spin" size={20} aria-hidden="true" />
          Checking Admin
        </div>
      </main>
    );
  }

  if (authState === "login") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#fffafa] px-5 py-12 text-[#12070a]">
        <section className="w-full max-w-md rounded-lg border border-[#f0e8e9] bg-white p-7 card-shadow">
          <div className="flex items-center gap-4">
            <Image
              src="/crimson-dominators-logo.svg"
              alt="Crimson Dominators logo"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
            />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#b00020]">Admin</p>
              <h1 className="text-2xl font-black text-[#111111]">Crimson Dominators</h1>
            </div>
          </div>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#790015]">
                Username
              </span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] px-4 text-sm font-bold outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#790015]">
                Password
              </span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] px-4 text-sm font-bold outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
                autoComplete="current-password"
              />
            </label>
            {notice ? <Notice notice={notice} /> : null}
            <button
              type="submit"
              disabled={loginLoading}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#b00020] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginLoading ? (
                <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              ) : (
                <LockKeyhole size={18} aria-hidden="true" />
              )}
              {loginLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffafa] text-[#12070a]">
      <header className="border-b border-[#f0e8e9] bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Image
              src="/crimson-dominators-logo.svg"
              alt="Crimson Dominators logo"
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[#b00020]">
                Protected Admin
              </p>
              <h1 className="truncate text-2xl font-black text-[#111111]">Crimson Dominators</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchContent}
              disabled={contentLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e8dfe1] bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#111111] transition hover:border-[#b00020] hover:text-[#b00020] disabled:opacity-60"
            >
              <RefreshCcw
                className={contentLoading ? "animate-spin" : ""}
                size={16}
                aria-hidden="true"
              />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#111111] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#b00020]"
            >
              <LogOut size={16} aria-hidden="true" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
        {notice ? <Notice notice={notice} /> : null}

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Join Requests" value={submissionCount} icon={<Shield size={20} />} />
          <Metric label="Gallery Items" value={content?.gallery.length ?? 0} icon={<ImagePlus size={20} />} />
          <Metric label="Visible Photos" value={visibleGalleryCount} icon={<Eye size={20} />} />
        </section>

        <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.95fr]">
          <form
            onSubmit={saveSettings}
            className="rounded-lg border border-[#f0e8e9] bg-white p-6 card-shadow"
          >
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b00020]">
                  Website Content
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#111111]">Title, text, and counters</h2>
              </div>
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#b00020] px-4 text-sm font-black text-white transition hover:bg-[#790015] disabled:opacity-60"
              >
                {savingSettings ? (
                  <Loader2 className="animate-spin" size={17} aria-hidden="true" />
                ) : (
                  <Save size={17} aria-hidden="true" />
                )}
                {savingSettings ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <AdminTextInput
                label="Website Title"
                value={settingsForm.website_title}
                onChange={(value) => updateSettings("website_title", value)}
              />
              <AdminTextInput
                label="Website Subtitle"
                value={settingsForm.website_subtitle}
                onChange={(value) => updateSettings("website_subtitle", value)}
              />
              <AdminTextArea
                label="About Text"
                value={settingsForm.about_text}
                onChange={(value) => updateSettings("about_text", value)}
              />
              <AdminTextArea
                label="Mission Text"
                value={settingsForm.mission_text}
                onChange={(value) => updateSettings("mission_text", value)}
              />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <AdminNumberInput
                label="Members Count"
                value={settingsForm.members_count}
                onChange={(value) => updateSettings("members_count", value)}
              />
              <AdminNumberInput
                label="People Helped"
                value={settingsForm.people_helped_count}
                onChange={(value) => updateSettings("people_helped_count", value)}
              />
              <AdminNumberInput
                label="Events Done"
                value={settingsForm.events_done_count}
                onChange={(value) => updateSettings("events_done_count", value)}
              />
              <AdminNumberInput
                label="Active Supporters"
                value={settingsForm.active_supporters_count}
                onChange={(value) => updateSettings("active_supporters_count", value)}
              />
            </div>
          </form>

          <section className="rounded-lg border border-[#f0e8e9] bg-white p-6 card-shadow">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b00020]">
                Join Submissions
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#111111]">Requests from students</h2>
            </div>
            <div className="mt-6 space-y-4">
              {contentLoading ? (
                <InlineLoading label="Loading submissions" />
              ) : content?.submissions.length ? (
                content.submissions.map((submission) => (
                  <article
                    key={submission.id}
                    className="rounded-lg border border-[#f0e8e9] bg-[#fffafa] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-black text-[#111111]">{submission.name}</h3>
                        <p className="mt-1 text-sm font-bold text-[#5f5f66]">
                          Class {submission.class_name} · {submission.phone}
                        </p>
                        <p className="mt-3 text-sm font-semibold leading-6 text-[#3a3032]">
                          {submission.message}
                        </p>
                        <time className="mt-3 block text-xs font-black uppercase tracking-[0.16em] text-[#8f7d81]">
                          {new Date(submission.created_at).toLocaleString()}
                        </time>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteSubmission(submission.id)}
                        disabled={busyId === submission.id}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-red-200 bg-white text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                        aria-label={`Delete submission from ${submission.name}`}
                      >
                        {busyId === submission.id ? (
                          <Loader2 className="animate-spin" size={17} aria-hidden="true" />
                        ) : (
                          <Trash2 size={17} aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState text="No join requests yet." />
              )}
            </div>
          </section>
        </section>

        <section className="mt-8 rounded-lg border border-[#f0e8e9] bg-white p-6 card-shadow">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b00020]">
                Gallery
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#111111]">Photo cards</h2>
            </div>
          </div>

          <form onSubmit={addGalleryItem} className="mt-6 grid gap-4 border-b border-[#f0e8e9] pb-6 lg:grid-cols-[1fr_1.4fr_1fr_120px_auto] lg:items-end">
            <AdminTextInput
              label="Title"
              value={draft.title}
              onChange={(value) => setDraft((current) => ({ ...current, title: value }))}
            />
            <AdminTextInput
              label="Image URL"
              value={draft.image_url}
              onChange={(value) => setDraft((current) => ({ ...current, image_url: value }))}
            />
            <AdminTextInput
              label="Alt Text"
              value={draft.alt_text}
              onChange={(value) => setDraft((current) => ({ ...current, alt_text: value }))}
            />
            <AdminNumberInput
              label="Order"
              value={draft.sort_order}
              onChange={(value) =>
                setDraft((current) => ({ ...current, sort_order: Math.max(0, Number(value || 0)) }))
              }
            />
            <button
              type="submit"
              disabled={busyId === "new-gallery"}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#b00020] disabled:opacity-60"
            >
              {busyId === "new-gallery" ? (
                <Loader2 className="animate-spin" size={17} aria-hidden="true" />
              ) : (
                <ImagePlus size={17} aria-hidden="true" />
              )}
              Add
            </button>
          </form>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {contentLoading ? (
              <InlineLoading label="Loading gallery" />
            ) : content?.gallery.length ? (
              content.gallery.map((item) => (
                <article key={item.id} className="rounded-lg border border-[#f0e8e9] bg-[#fffafa] p-4">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-[#f0e8e9] bg-white">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.alt_text}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <Image
                            src="/crimson-dominators-logo.svg"
                            alt=""
                            width={70}
                            height={70}
                            className="h-16 w-16 object-contain opacity-30"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <AdminTextInput
                        label="Title"
                        value={item.title}
                        onChange={(value) => updateGalleryItem(item.id, "title", value)}
                      />
                      <AdminTextInput
                        label="Image URL"
                        value={item.image_url ?? ""}
                        onChange={(value) => updateGalleryItem(item.id, "image_url", value)}
                      />
                      <AdminTextInput
                        label="Alt Text"
                        value={item.alt_text}
                        onChange={(value) => updateGalleryItem(item.id, "alt_text", value)}
                      />
                      <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                        <AdminNumberInput
                          label="Order"
                          value={item.sort_order}
                          onChange={(value) =>
                            updateGalleryItem(item.id, "sort_order", Math.max(0, Number(value || 0)))
                          }
                        />
                        <label className="flex items-end">
                          <span className="flex h-12 w-full items-center justify-between rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-black text-[#111111]">
                            Visible
                            <input
                              type="checkbox"
                              checked={item.is_visible}
                              onChange={(event) =>
                                updateGalleryItem(item.id, "is_visible", event.target.checked)
                              }
                              className="h-5 w-5 accent-[#b00020]"
                            />
                          </span>
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => saveGalleryItem(item)}
                          disabled={busyId === item.id}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#b00020] px-4 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#790015] disabled:opacity-60"
                        >
                          {busyId === item.id ? (
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                          ) : (
                            <Save size={16} aria-hidden="true" />
                          )}
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteGalleryItem(item.id)}
                          disabled={busyId === item.id}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Delete
                        </button>
                        <span className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#e8dfe1] bg-white px-4 text-xs font-black uppercase tracking-[0.12em] text-[#5f5f66]">
                          {item.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                          {item.is_visible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <EmptyState text="No gallery items yet." />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Notice({ notice }: { notice: { type: "success" | "error"; message: string } }) {
  return (
    <div
      className={`mb-6 rounded-lg border px-4 py-3 text-sm font-bold ${
        notice.type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-red-200 bg-red-50 text-red-800"
      }`}
      role="status"
    >
      {notice.message}
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#f0e8e9] bg-white p-5 card-shadow">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5f5f66]">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#b00020] text-white">
          {icon}
        </span>
      </div>
      <p className="mt-5 text-4xl font-black text-[#111111]">{value}</p>
    </div>
  );
}

function AdminTextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#790015]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-bold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
      />
    </label>
  );
}

function AdminNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#790015]">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-bold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
      />
    </label>
  );
}

function AdminTextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[#790015]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-lg border border-[#e8dfe1] bg-white px-4 py-3 text-sm font-bold leading-6 text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
      />
    </label>
  );
}

function InlineLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#f0e8e9] bg-[#fffafa] p-4 text-sm font-black uppercase tracking-[0.16em] text-[#b00020]">
      <Loader2 className="animate-spin" size={18} aria-hidden="true" />
      {label}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#e5d8db] bg-[#fffafa] p-6 text-center text-sm font-bold text-[#5f5f66]">
      {text}
    </div>
  );
}
