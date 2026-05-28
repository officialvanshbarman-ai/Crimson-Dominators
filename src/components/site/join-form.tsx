"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

type FormState = {
  name: string;
  className: string;
  phone: string;
  message: string;
};

const initialFormState: FormState = {
  name: "",
  className: "",
  phone: "",
  message: "",
};

export function JoinForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit your request.");
      }

      setForm(initialFormState);
      setStatus({
        type: "success",
        message: result.message || "Your request was submitted successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to submit your request.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#790015]">Name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
            minLength={2}
            className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-semibold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-[#790015]">Class</span>
          <input
            value={form.className}
            onChange={(event) => updateField("className", event.target.value)}
            required
            className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-semibold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
            placeholder="Your class"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-[#790015]">
          Phone Number
        </span>
        <input
          value={form.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          required
          inputMode="tel"
          className="mt-2 h-12 w-full rounded-lg border border-[#e8dfe1] bg-white px-4 text-sm font-semibold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
          placeholder="+91 00000 00000"
        />
      </label>
      <label className="block">
        <span className="text-xs font-black uppercase tracking-[0.22em] text-[#790015]">Message</span>
        <textarea
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
          required
          minLength={5}
          rows={5}
          className="mt-2 w-full resize-none rounded-lg border border-[#e8dfe1] bg-white px-4 py-3 text-sm font-semibold text-[#12070a] outline-none transition focus:border-[#b00020] focus:ring-4 focus:ring-[#b00020]/10"
          placeholder="Tell us why you want to join"
        />
      </label>
      {status ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-bold ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
          role="status"
        >
          {status.message}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 text-sm font-black text-white transition hover:bg-[#b00020] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : (
          <Send size={17} aria-hidden="true" />
        )}
        {isSubmitting ? "Submitting..." : "Send Request"}
      </button>
    </form>
  );
}
