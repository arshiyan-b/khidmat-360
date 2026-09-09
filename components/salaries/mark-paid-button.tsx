"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markSalaryPaid } from "@/app/salaries/actions";

export function MarkPaidButton({
  staffId,
  month,
  year,
}: {
  staffId: string;
  month: number;
  year: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const result = await markSalaryPaid({ staffId, month, year });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Couldn't update this payment.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className="rounded-full bg-[var(--color-brass)] px-4 py-1.5 text-xs font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving…" : "Mark as paid"}
      </button>
      {error && <span className="text-xs text-[var(--color-rust)]">{error}</span>}
    </div>
  );
}
