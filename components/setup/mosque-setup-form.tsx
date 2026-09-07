"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mosqueSchema, type MosqueInput } from "@/lib/validations/mosque";
import { createMosque } from "@/app/dashboard/setup/actions";

export function MosqueSetupForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MosqueInput>({ resolver: zodResolver(mosqueSchema) });

  async function onSubmit(data: MosqueInput) {
    setServerError(null);
    const result = await createMosque(data);
    // On success the server action redirects, so we only ever reach
    // this line when it returned a validation error instead.
    if (result && !result.success) {
      setServerError(result.error ?? "Something went wrong. Try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-8 rounded-sm bg-[var(--color-parchment)] p-8 shadow-2xl shadow-black/40"
    >
      <label className="block text-sm font-medium text-[var(--color-ink)]">
        Masjid name
        <input
          {...register("name")}
          className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          placeholder="Masjid-e-Noor"
        />
      </label>
      {errors.name && (
        <p className="mt-1 text-xs text-[var(--color-rust)]">{errors.name.message}</p>
      )}

      <label className="mt-5 block text-sm font-medium text-[var(--color-ink)]">
        Address <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
        <input
          {...register("address")}
          className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          placeholder="Street, area, city"
        />
      </label>

      {serverError && (
        <p role="alert" className="mt-4 rounded-sm bg-[var(--color-rust)]/10 px-3 py-2 text-sm text-[var(--color-rust)]">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 w-full rounded-full bg-[var(--color-brass)] px-5 py-3 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Setting up…" : "Continue to dashboard"}
      </button>
    </form>
  );
}
