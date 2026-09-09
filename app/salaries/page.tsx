import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { MarkPaidButton } from "@/components/salaries/mark-paid-button";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default async function SalariesPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const mosqueId = session.user.mosqueId;
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [activeStaff, thisMonthPayments, recentPayments] = await Promise.all([
    prisma.staff.findMany({
      where: { mosqueId, status: "ACTIVE" },
      orderBy: { name: "asc" },
    }),
    prisma.salaryPayment.findMany({
      where: { month, year, staff: { mosqueId } },
    }),
    prisma.salaryPayment.findMany({
      where: { staff: { mosqueId } },
      include: { staff: true },
      orderBy: [{ year: "desc" }, { month: "desc" }],
      take: 20,
    }),
  ]);

  const paymentByStaffId = new Map(thisMonthPayments.map((p) => [p.staffId, p]));

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/salaries" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              People
            </p>
            <h1 className="font-display text-2xl italic">Salaries</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <section>
            <h2 className="font-display text-lg italic">
              {monthNames[month - 1]} {year}
            </h2>
            <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
              {activeStaff.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                  No active staff yet — add one on the Staff page first.
                </p>
              ) : (
                activeStaff.map((s) => {
                  const payment = paymentByStaffId.get(s.id);
                  const isPaid = payment?.status === "PAID";
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="font-mono text-xs text-[var(--color-ink)]/50">
                          {formatRs(Number(s.salary))}
                        </p>
                      </div>
                      {isPaid ? (
                        <span className="font-mono text-xs uppercase tracking-wide text-[#8a6117]">
                          Paid
                        </span>
                      ) : (
                        <MarkPaidButton staffId={s.id} month={month} year={year} />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-lg italic">Payment history</h2>
            <div className="mt-4 overflow-hidden rounded-sm bg-white/40">
              {recentPayments.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                  No salary payments recorded yet.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-parchment-dim)] font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                      <th className="px-4 py-3 font-medium">Staff</th>
                      <th className="px-4 py-3 font-medium">Month</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-parchment-dim)]">
                    {recentPayments.map((p) => (
                      <tr key={p.id} className="font-mono">
                        <td className="px-4 py-3">{p.staff.name}</td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/70">
                          {monthNames[p.month - 1]} {p.year}
                        </td>
                        <td
                          className={
                            p.status === "PAID"
                              ? "px-4 py-3 text-xs uppercase text-[#8a6117]"
                              : "px-4 py-3 text-xs uppercase text-[var(--color-rust)]"
                          }
                        >
                          {p.status}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatRs(Number(p.amount))}
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
