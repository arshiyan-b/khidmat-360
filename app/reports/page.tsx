import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

const monthNamesShort = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const donationCategoryLabels: Record<string, string> = {
  GENERAL: "General Donation",
  CONSTRUCTION: "Masjid Construction",
  MAINTENANCE: "Maintenance",
  RAMADAN: "Ramadan",
  ZAKAT: "Zakat",
  FITRAH: "Fitrah",
  OTHER: "Other",
};

const expenseCategoryLabels: Record<string, string> = {
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

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const mosqueId = session.user.mosqueId;
  const now = new Date();

  // Last 6 months, oldest first
  const months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    return { label: `${monthNamesShort[d.getMonth()]} ${d.getFullYear()}`, start, end };
  });

  const [monthlyTotals, donationByCategory, expenseByCategory, activeStaffCount, paidThisMonthCount] =
    await Promise.all([
      Promise.all(
        months.map(async ({ label, start, end }) => {
          const [donations, expenses] = await Promise.all([
            prisma.donation.aggregate({
              _sum: { amount: true },
              where: { mosqueId, donationDate: { gte: start, lt: end } },
            }),
            prisma.expense.aggregate({
              _sum: { amount: true },
              where: { mosqueId, expenseDate: { gte: start, lt: end } },
            }),
          ]);
          const income = Number(donations._sum.amount ?? 0);
          const outgoing = Number(expenses._sum.amount ?? 0);
          return { label, income, outgoing, net: income - outgoing };
        })
      ),
      prisma.donation.groupBy({
        by: ["category"],
        where: { mosqueId },
        _sum: { amount: true },
      }),
      prisma.expense.groupBy({
        by: ["category"],
        where: { mosqueId },
        _sum: { amount: true },
      }),
      prisma.staff.count({ where: { mosqueId, status: "ACTIVE" } }),
      prisma.salaryPayment.count({
        where: {
          staff: { mosqueId },
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          status: "PAID",
        },
      }),
    ]);

  const maxMonthly = Math.max(1, ...monthlyTotals.flatMap((m) => [m.income, m.outgoing]));

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/reports" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Overview
            </p>
            <h1 className="font-display text-2xl italic">Reports</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <section>
            <h2 className="font-display text-lg italic">Last 6 months</h2>
            <div className="mt-4 overflow-hidden rounded-sm bg-white/40 p-4">
              <div className="flex items-end gap-4" style={{ height: 160 }}>
                {monthlyTotals.map((m) => (
                  <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-full items-end gap-1">
                      <div
                        title={`In: ${formatRs(m.income)}`}
                        className="w-3 rounded-t-sm bg-[#8a6117]/70"
                        style={{ height: `${(m.income / maxMonthly) * 100}%` }}
                      />
                      <div
                        title={`Out: ${formatRs(m.outgoing)}`}
                        className="w-3 rounded-t-sm bg-[var(--color-rust)]/70"
                        style={{ height: `${(m.outgoing / maxMonthly) * 100}%` }}
                      />
                    </div>
                    <p className="mt-1 font-mono text-[10px] uppercase text-[var(--color-ink)]/50">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-sm bg-white/40">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-parchment-dim)] font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                    <th className="px-4 py-2 font-medium">Month</th>
                    <th className="px-4 py-2 text-right font-medium">In</th>
                    <th className="px-4 py-2 text-right font-medium">Out</th>
                    <th className="px-4 py-2 text-right font-medium">Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-parchment-dim)] font-mono">
                  {monthlyTotals.map((m) => (
                    <tr key={m.label}>
                      <td className="px-4 py-2">{m.label}</td>
                      <td className="px-4 py-2 text-right text-[#8a6117]">{formatRs(m.income)}</td>
                      <td className="px-4 py-2 text-right text-[var(--color-rust)]">{formatRs(m.outgoing)}</td>
                      <td className="px-4 py-2 text-right">{formatRs(m.net)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="font-display text-lg italic">Donations by category</h2>
              <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                {donationByCategory.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">No donations recorded yet.</p>
                ) : (
                  donationByCategory.map((row) => (
                    <div key={row.category} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>{donationCategoryLabels[row.category] ?? row.category}</span>
                      <span className="font-mono text-[#8a6117]">
                        {formatRs(Number(row._sum.amount ?? 0))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg italic">Expenses by category</h2>
              <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                {expenseByCategory.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">No expenses recorded yet.</p>
                ) : (
                  expenseByCategory.map((row) => (
                    <div key={row.category} className="flex items-center justify-between px-4 py-3 text-sm">
                      <span>{expenseCategoryLabels[row.category] ?? row.category}</span>
                      <span className="font-mono text-[var(--color-rust)]">
                        {formatRs(Number(row._sum.amount ?? 0))}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <section className="mt-10">
            <h2 className="font-display text-lg italic">Salaries this month</h2>
            <div className="mt-4 rounded-sm bg-white/40 px-4 py-3 text-sm">
              <span className="font-mono text-[#8a6117]">{paidThisMonthCount}</span> of{" "}
              <span className="font-mono">{activeStaffCount}</span> active staff paid
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
