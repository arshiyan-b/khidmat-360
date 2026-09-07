"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventSchema,
  eventCategories,
  type EventInput,
} from "@/lib/validations/event";
import { createEvent } from "@/app/events/actions";

const categoryLabels: Record<(typeof eventCategories)[number], string> = {
  JUMMAH: "Jummah",
  TARAWEEH: "Taraweeh",
  EID: "Eid Prayers",
  QURAN_CLASS: "Quran Class",
  LECTURE: "Islamic Lecture",
  FUNDRAISING: "Fundraising",
  OTHER: "Other",
};

export function EventForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: { category: "OTHER" },
  });

  async function onSubmit(data: EventInput) {
    setServerError(null);
    setSaved(false);

    const result = await createEvent(data);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save that event. Try again.");
      return;
    }

    setSaved(true);
    reset({ category: "OTHER" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm bg-white/40 p-6"
    >
      <h2 className="font-display text-lg italic">Add an event</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Title
          <input
            {...register("title")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="e.g. Ramadan Taraweeh — Night 1"
          />
          {errors.title && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.title.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Category
          <select
            {...register("category")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          >
            {eventCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </label>

        <div />

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Starts
          <input
            type="datetime-local"
            {...register("startsAt", { valueAsDate: true })}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
          {errors.startsAt && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.startsAt.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Ends <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            type="datetime-local"
            {...register("endsAt", { valueAsDate: true })}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
          {errors.endsAt && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.endsAt.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Description <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("description")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="e.g. Followed by light refreshments"
          />
        </label>
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-4 rounded-sm bg-[var(--color-rust)]/10 px-3 py-2 text-sm text-[var(--color-rust)]"
        >
          {serverError}
        </p>
      )}

      {saved && (
        <p className="mt-4 rounded-sm bg-[#8a6117]/10 px-3 py-2 text-sm text-[#8a6117]">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-[var(--color-brass)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save event"}
      </button>
    </form>
  );
}
