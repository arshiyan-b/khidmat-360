"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  donationSchema,
  donationCategories,
  paymentMethods,
  type DonationInput,
} from "@/lib/validations/donation";
import { createDonation } from "@/app/dashboard/donations/actions";

const categoryLabels: Record<(typeof donationCategories)[number], string> = {
  GENERAL: "General Donation",
  CONSTRUCTION: "Masjid Construction",
  MAINTENANCE: "Maintenance",
  RAMADAN: "Ramadan",
  ZAKAT: "Zakat",
  FITRAH: "Fitrah",
  OTHER: "Other",
};

const methodLabels: Record<(typeof paymentMethods)[number], string> = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  CARD: "Card",
  ONLINE: "Online",
  OTHER: "Other",
};

export function DonationForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: { category: "GENERAL", paymentMethod: "CASH" },
  });

  async function onSubmit(data: DonationInput) {
    setServerError(null);
    setSuccessReceipt(null);

    const result = await createDonation(data);

    if (!result.success) {
      setServerError(result.error ?? "Couldn't save that donation. Try again.");
      return;
    }

    setSuccessReceipt(result.receiptNumber);
    reset({ category: "GENERAL", paymentMethod: "CASH" });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-sm bg-white/40 p-6"
    >
      <h2 className="font-display text-lg italic">Record a donation</h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Donor name <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("donorName")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="Anonymous if left blank"
          />
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Amount (Rs)
          <input
            type="number"
            step="1"
            min="1"
            {...register("amount", { valueAsNumber: true })}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="5000"
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
            {donationCategories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Payment method
          <select
            {...register("paymentMethod")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
          >
            {paymentMethods.map((m) => (
              <option key={m} value={m}>
                {methodLabels[m]}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          Purpose <span className="font-normal text-[var(--color-ink)]/50">(optional)</span>
          <input
            {...register("purpose")}
            className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
            placeholder="e.g. New water cooler for the courtyard"
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

      {successReceipt && (
        <p className="mt-4 rounded-sm bg-[#8a6117]/10 px-3 py-2 font-mono text-sm text-[#8a6117]">
          Saved — receipt {successReceipt}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-full bg-[var(--color-brass)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : "Save donation"}
      </button>
    </form>
  );
}
