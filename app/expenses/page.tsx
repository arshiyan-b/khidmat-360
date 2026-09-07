import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { ExpenseForm } from "@/components/expenses/expense-form";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

const categoryLabels: Record<string, string> = {
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

export default async function ExpensesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const expenses = await prisma.expense.findMany({
    where: { mosqueId: session.user.mosqueId },
    orderBy: { expenseDate: "desc" },
    take: 50,
  });

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/expenses" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Ledger
            </p>
            <h1 className="font-display text-2xl italic">Expenses</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <ExpenseForm />

          <section className="mt-10">
            <h2 className="font-display text-lg italic">All expenses</h2>
            <div className="mt-4 overflow-hidden rounded-sm bg-white/40">
              {expenses.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                  No expenses recorded yet — add the first one above.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-parchment-dim)] font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Description</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-parchment-dim)]">
                    {expenses.map((e) => (
                      <tr key={e.id} className="font-mono">
                        <td className="px-4 py-3 text-[var(--color-ink)]/70">
                          {categoryLabels[e.category] ?? e.category}
                        </td>
                        <td className="px-4 py-3">{e.description ?? "—"}</td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/50">
                          {e.expenseDate.toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--color-rust)]">
                          {formatRs(Number(e.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
