"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  expenseSchema,
  expenseCategories,
  type ExpenseInput,
} from "@/lib/validations/expense";
import { createExpense } from "@/app/expenses/actions";

const categoryLabels: Record<(typeof expenseCategories)[number], string> = {
  ELECTRICITY: "Electricity",
  WATER: "Water",
  GAS: "Gas",
  CLEANING: "Cleaning",
  MAINTENANCE: "Maintenance",
  CONSTRUCTION: "Construction",
  SALARIES: "Staff Salaries",
  SECURITY: "Security",
  OTHER: "Other",
};

export function ExpenseForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: "OTHER" },
  });

  async function onSubmit(data: ExpenseInput) {
    setServerError(null);
    setSaved(false);

    const result = await createExpense(data);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save that expense. Try again.");
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
      <h2 className="font-display text-lg italic">Record an expense</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Amount (Rs)
          <input
            type="number"
            step="1"
            min="1"
            {...register("amount", { valueAsNumber: true })}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="3200"
          />
          {errors.amount && (
            <span className="mt-1 block text-xs text-[var(--color-rust)]">
              {errors.amount.message}
            </span>
          )}
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Category
          <select
            {...register("category")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          >
            {expenseCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Description <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("description")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="e.g. Monthly electricity bill"
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
        <p className="mt-4 rounded-sm bg-[var(--color-rust)]/10 px-3 py-2 text-sm text-[var(--color-rust)]">
          Saved.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-[var(--color-brass)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save expense"}
      </button>
    </form>
  );
}
