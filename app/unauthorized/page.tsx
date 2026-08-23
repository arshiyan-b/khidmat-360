export default function UnauthorizedPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-[var(--color-parchment)] px-6 py-24 text-center text-[var(--color-ink)]">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-rust)]">
        Not available
      </p>
      <h1 className="font-display text-2xl italic">
        Your account doesn&apos;t have access to this page.
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-ink)]/70">
        If you think this is a mistake, ask your masjid&apos;s Admin to check
        your role.
      </p>
    </div>
  );
}
