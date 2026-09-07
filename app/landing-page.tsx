import Image from "next/image";

type LedgerEntry = {
  direction: "in" | "out";
  amount: string;
  label: string;
  method: string;
};

const ledgerEntries: LedgerEntry[] = [
  { direction: "in", amount: "15,000", label: "General Donation", method: "Card" },
  { direction: "in", amount: "5,000", label: "Zakat", method: "Cash" },
  { direction: "out", amount: "3,200", label: "Electricity Bill", method: "Bank Transfer" },
  { direction: "in", amount: "40,000", label: "Masjid Construction", method: "Bank Transfer" },
  { direction: "out", amount: "28,000", label: "Imam Salary — Nov", method: "Cash" },
  { direction: "in", amount: "2,500", label: "Jummah Collection", method: "Cash" },
  { direction: "out", amount: "1,100", label: "Cleaning Supplies", method: "Cash" },
  { direction: "in", amount: "8,000", label: "Fitrah", method: "Cash" },
];

function LedgerTape() {
  const doubled = [...ledgerEntries, ...ledgerEntries];
  return (
    <div className="relative">
      <div className="receipt-tear relative mx-auto w-full max-w-sm rotate-1 overflow-hidden rounded-sm bg-[var(--color-parchment)] pb-3 shadow-2xl shadow-black/40">
        <div className="border-b border-dashed border-black/20 px-6 pb-3 pt-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-black/50">
            Khidmat-360 · Live Ledger
          </p>
        </div>
        <div className="h-[360px] overflow-hidden px-6">
          <div className="animate-ticker">
            {doubled.map((entry, i) => (
              <div
                key={i}
                className="flex items-baseline justify-between gap-3 border-b border-black/10 py-3 font-mono text-[13px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-black/80">{entry.label}</p>
                  <p className="text-[10px] uppercase tracking-wide text-black/40">
                    {entry.method}
                  </p>
                </div>
                <p
                  className={
                    entry.direction === "in"
                      ? "shrink-0 text-[#8a6117]"
                      : "shrink-0 text-[var(--color-rust)]"
                  }
                >
                  {entry.direction === "in" ? "+" : "−"} Rs {entry.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 flex w-full max-w-sm items-center justify-between px-2 font-mono text-xs text-[var(--color-sage)]">
        <span>Balance, running</span>
        <span className="text-base text-[var(--color-parchment)]">Rs 1,842,300</span>
      </div>
    </div>
  );
}

function GeometricBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
    >
      <defs>
        <pattern
          id="star-lattice"
          width="56"
          height="56"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M28 0 L38 18 L56 28 L38 38 L28 56 L18 38 L0 28 L18 18 Z"
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#star-lattice)" />
    </svg>
  );
}

const features = [
  {
    eyebrow: "Donations",
    title: "Every donor, every purpose, on record",
    body:
      "Log donations by category — Zakat, Fitrah, Ramadan, Construction, General — with donor names, payment method, and a receipt number generated automatically.",
  },
  {
    eyebrow: "Expenses",
    title: "Where the money went, itemised",
    body:
      "Electricity, water, security, cleaning, maintenance — every outgoing rupee is categorised so your committee can explain the month at a glance.",
  },
  {
    eyebrow: "Staff & Salaries",
    title: "Imam, muazzin, and staff, paid on time",
    body:
      "Keep staff records and monthly salary status together, so nothing outstanding slips past a busy committee meeting.",
  },
  {
    eyebrow: "Reports & Receipts",
    title: "Printable proof, whenever it's asked for",
    body:
      "Generate monthly income, expense, and balance reports, plus donation receipts with the masjid's own details — ready to hand over or print.",
  },
];

const steps = [
  {
    number: "01",
    title: "Add your masjid",
    body: "Name, address, and the basics — set up once, in a few minutes.",
  },
  {
    number: "02",
    title: "Invite your committee",
    body: "Admin and Accountant roles, so no one shares a login to see what they need.",
  },
  {
    number: "03",
    title: "Start recording",
    body: "Every donation and every expense, from day one, visible to whoever asks.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-[var(--color-parchment)] font-sans text-[var(--color-ink)]">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2">
          <Image src="/brand/logo-symbol.png" alt="" width={28} height={28} />
          <span className="font-display text-lg tracking-tight">Khidmat-360</span>
        </div>
        <a
          href="#get-started"
          className="rounded-full border border-[var(--color-ink)]/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-ink)]/5"
        >
          Sign in
        </a>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-parchment)]">
        <GeometricBackdrop />
        <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 py-20 sm:px-10 md:grid-cols-2 md:items-center md:py-28">
          <div className="fade-up">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass-bright)]">
              Amanah, accounted for
            </p>
            <h1 className="font-display text-4xl italic leading-[1.15] sm:text-5xl">
              Every rupee in. Every rupee out.{" "}
              <span className="not-italic text-[var(--color-brass-bright)]">
                Visible.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--color-sage)]">
              Khidmat-360 gives your masjid committee one place to record
              donations, pay staff, track expenses, and show your community
              exactly where the money went. No spreadsheets, no guesswork.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                id="get-started"
                href="#steps"
                className="rounded-full bg-[var(--color-brass)] px-6 py-3 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)]"
              >
                Set up your masjid
              </a>
              <a
                href="#ledger"
                className="rounded-full border border-[var(--color-parchment)]/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-white/5"
              >
                See a sample ledger
              </a>
            </div>
          </div>
          <div id="ledger" className="fade-up [animation-delay:150ms]">
            <LedgerTape />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass)]">
          The ledger
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl italic leading-tight sm:text-4xl">
          Everything a committee needs, nothing it doesn&apos;t.
        </h2>
        <div className="mt-14 grid gap-px overflow-hidden rounded-sm bg-[var(--color-parchment-dim)] sm:grid-cols-2">
          {features.map((f) => (
            <div key={f.eyebrow} className="bg-[var(--color-parchment)] p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-rust)]">
                {f.eyebrow}
              </p>
              <h3 className="mt-3 font-display text-xl leading-snug">
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]/70">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / localisation */}
      <section className="bg-[var(--color-ink-shadow)] text-[var(--color-parchment)]">
        <div className="mx-auto w-full max-w-6xl px-6 py-24 text-center sm:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass-bright)]">
            Built for masajid in Pakistan
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-2xl italic leading-relaxed sm:text-3xl">
            Simple enough for a committee member who has never used a
            spreadsheet. Thorough enough for a community that expects an
            answer to every question about where their donation went.
          </h2>
          <div className="mt-14 border-t border-[var(--color-parchment)]/15 pt-10">
            <p dir="rtl" lang="ar" className="font-display text-2xl">
              نظام الأمانة لإدارة المساجد
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--color-sage)]">
              Trusted management for every masjid
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="steps" className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass)]">
          Getting started
        </p>
        <h2 className="mt-3 max-w-xl font-display text-3xl italic leading-tight sm:text-4xl">
          Three steps, one afternoon.
        </h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.number}>
              <p className="font-mono text-3xl text-[var(--color-brass)]">
                {s.number}
              </p>
              <h3 className="mt-3 font-display text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink)]/70">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[var(--color-ink)] text-[var(--color-parchment)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-6 py-24 sm:px-10 md:flex-row md:items-center md:justify-between">
          <h2 className="max-w-md font-display text-2xl italic leading-snug sm:text-3xl">
            Your community trusted you with this. Show them how it&apos;s
            spent.
          </h2>
          <a
            href="#get-started"
            className="shrink-0 rounded-full bg-[var(--color-brass)] px-7 py-3 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)]"
          >
            Set up your masjid
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-[var(--color-ink)]/60 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Khidmat-360</span>
          <div className="flex gap-6">
            <a href="#ledger" className="hover:text-[var(--color-ink)]">
              Features
            </a>
            <a href="#steps" className="hover:text-[var(--color-ink)]">
              How it works
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}