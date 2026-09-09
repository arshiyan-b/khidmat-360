"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden rounded-full bg-[var(--color-brass)] px-6 py-2.5 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)]"
    >
      Print receipt
    </button>
  );
}
