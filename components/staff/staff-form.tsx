"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  staffSchema,
  staffRoles,
  staffStatuses,
  type StaffInput,
} from "@/lib/validations/staff";
import { createStaff } from "@/app/staff/actions";

const roleLabels: Record<(typeof staffRoles)[number], string> = {
  IMAM: "Imam",
  MUAZZIN: "Muazzin",
  TEACHER: "Teacher",
  CLEANER: "Cleaner",
  SECURITY: "Security",
  OTHER: "Other",
};

const statusLabels: Record<(typeof staffStatuses)[number], string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ON_LEAVE: "On Leave",
};

export function StaffForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StaffInput>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: "OTHER", status: "ACTIVE" },
  });

  async function onSubmit(data: StaffInput) {
    setServerError(null);
    setSaved(false);

    const result = await createStaff(data);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save that staff member. Try again.");
      return;
    }

    setSaved(true);
    reset({ role: "OTHER", status: "ACTIVE" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm bg-white/40 p-6"
    >
      <h2 className="font-display text-lg italic">Add a staff member</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Name
          <input
            {...register("name")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="e.g. Qari Abdullah"
          />
          {errors.name && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.name.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Role
          <select
            {...register("role")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          >
            {staffRoles.map((r) => (
              <option key={r} value={r}>
                {roleLabels[r]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Status
          <select
            {...register("status")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          >
            {staffStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabels[s]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Phone <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("phone")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Monthly salary (Rs)
          <input
            type="number"
            step="1"
            min="1"
            {...register("salary", { valueAsNumber: true })}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="30000"
          />
          {errors.salary && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.salary.message}
            </span>
          )}
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
        <p role="alert" className="mt-4 rounded-sm bg-[var(--color-rust)]/10 px-3 py-2 text-sm text-[var(--color-rust)]">
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
        {isSubmitting ? "Saving…" : "Save staff member"}
      </button>
    </form>
  );
}
