"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mosqueSchema, type MosqueInput } from "@/lib/validations/mosque";
import { updateMosque } from "@/app/profile/actions";

export function MosqueProfileForm({
  defaultValues,
}: {
  defaultValues: MosqueInput;
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MosqueInput>({
    resolver: zodResolver(mosqueSchema),
    defaultValues,
  });

  async function onSubmit(data: MosqueInput) {
    setServerError(null);
    setSaved(false);

    const result = await updateMosque(data);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save changes. Try again.");
      return;
    }

    setSaved(true);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl rounded-sm bg-white/40 p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Masjid name
          <input
            {...register("name")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
          {errors.name && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.name.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Address <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("address")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          City <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("city")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Phone <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("phone")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Email <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            type="email"
            {...register("email")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.email.message}
            </span>
          )}
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
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
