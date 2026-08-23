import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", active: true },
  { label: "Donations", href: "#", active: false },
  { label: "Expenses", href: "#", active: false },
  { label: "Staff", href: "#", active: false },
  { label: "Salaries", href: "#", active: false },
  { label: "Reports", href: "#", active: false },
  { label: "Receipts", href: "#", active: false },
  { label: "Events", href: "#", active: false },
];

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const monthStart = startOfMonth();

  const [
    donationTotal,
    expenseTotal,
    monthlyDonationTotal,
    monthlyExpenseTotal,
    recentDonations,
    recentExpenses,
    upcomingEvents,
    pendingSalaryPayments,
  ] = await Promise.all([
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: { donationDate: { gte: monthStart } },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { expenseDate: { gte: monthStart } },
    }),
    prisma.donation.findMany({
      take: 5,
      orderBy: { donationDate: "desc" },
      include: { donor: true },
    }),
    prisma.expense.findMany({
      take: 5,
      orderBy: { expenseDate: "desc" },
    }),
    prisma.event.findMany({
      take: 4,
      where: { startsAt: { gte: new Date() } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.salaryPayment.findMany({
      take: 5,
      where: { status: { in: ["PENDING", "OVERDUE"] } },
      include: { staff: true },
      orderBy: { year: "desc" },
    }),
  ]);

  const totalDonations = Number(donationTotal._sum.amount ?? 0);
  const totalExpenses = Number(expenseTotal._sum.amount ?? 0);
  const balance = totalDonations - totalExpenses;
  const monthlyIncome = Number(monthlyDonationTotal._sum.amount ?? 0);
  const monthlyExpense = Number(monthlyExpenseTotal._sum.amount ?? 0);

  const recentTransactions = [
    ...recentDonations.map((d) => ({
      id: d.id,
      date: d.donationDate,
      label: d.donor?.name ?? d.category.replaceAll("_", " "),
      amount: Number(d.amount),
      direction: "in" as const,
    })),
    ...recentExpenses.map((e) => ({
      id: e.id,
      date: e.expenseDate,
      label: e.description ?? e.category.replaceAll("_", " "),
      amount: Number(e.amount),
      direction: "out" as const,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 6);

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--color-parchment-dim)] bg-[var(--color-ink)] px-5 py-8 text-[var(--color-parchment)] sm:flex">
        <span className="font-display text-lg tracking-tight">
          Khidmat-360
        </span>
        <nav className="mt-10 flex flex-col gap-1">
          {navItems.map((item) =>
            item.active ? (
              <a
                key={item.label}
                href={item.href}
                className="rounded-sm bg-white/10 px-3 py-2 text-sm font-medium"
              >
                {item.label}
              </a>
            ) : (
              <span
                key={item.label}
                className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-[var(--color-sage)]/60"
              >
                {item.label}
                <span className="font-mono text-[9px] uppercase tracking-wider">
                  Soon
                </span>
              </span>
            )
          )}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Overview
            </p>
            <h1 className="font-display text-2xl italic">
              Assalamu alaikum, {session.user.name.split(" ")[0]}
            </h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          {/* Summary cards */}
          <div className="grid gap-px overflow-hidden rounded-sm bg-[var(--color-parchment-dim)] sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard label="Total donations" value={formatRs(totalDonations)} />
            <SummaryCard label="Total expenses" value={formatRs(totalExpenses)} />
            <SummaryCard
              label="Current balance"
              value={formatRs(balance)}
              highlight
            />
            <SummaryCard label="This month, in" value={formatRs(monthlyIncome)} />
            <SummaryCard label="This month, out" value={formatRs(monthlyExpense)} />
          </div>

          {/* Detail sections */}
          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <h2 className="font-display text-lg italic">
                Recent transactions
              </h2>
              <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                {recentTransactions.length === 0 && (
                  <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                    No donations or expenses recorded yet.
                  </p>
                )}
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[var(--color-ink)]/80">
                        {t.label}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-[var(--color-ink)]/40">
                        {t.date.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <p
                      className={
                        t.direction === "in"
                          ? "shrink-0 text-[#8a6117]"
                          : "shrink-0 text-[var(--color-rust)]"
                      }
                    >
                      {t.direction === "in" ? "+" : "−"}{" "}
                      {formatRs(t.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex flex-col gap-8">
              <section>
                <h2 className="font-display text-lg italic">
                  Upcoming events
                </h2>
                <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                  {upcomingEvents.length === 0 && (
                    <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                      No upcoming events scheduled.
                    </p>
                  )}
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="px-4 py-3">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                        {event.startsAt.toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-display text-lg italic">
                  Pending payments
                </h2>
                <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                  {pendingSalaryPayments.length === 0 && (
                    <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                      No outstanding salary payments.
                    </p>
                  )}
                  {pendingSalaryPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between px-4 py-3 text-sm"
                    >
                      <span>{payment.staff.name}</span>
                      <span className="font-mono text-[var(--color-rust)]">
                        {formatRs(Number(payment.amount))}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        highlight
          ? "bg-[var(--color-ink)] p-6 text-[var(--color-parchment)]"
          : "bg-[var(--color-parchment)] p-6"
      }
    >
      <p
        className={
          highlight
            ? "font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brass-bright)]"
            : "font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)]/50"
        }
      >
        {label}
      </p>
      <p className="mt-2 font-display text-2xl italic">{value}</p>
    </div>
  );
}
