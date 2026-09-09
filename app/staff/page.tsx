import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { StaffForm } from "@/components/staff/staff-form";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

const roleLabels: Record<string, string> = {
  IMAM: "Imam",
  MUAZZIN: "Muazzin",
  TEACHER: "Teacher",
  CLEANER: "Cleaner",
  SECURITY: "Security",
  OTHER: "Other",
};

const statusStyles: Record<string, string> = {
  ACTIVE: "text-[#8a6117]",
  INACTIVE: "text-[var(--color-ink)]/40",
  ON_LEAVE: "text-[var(--color-rust)]",
};

const statusLabels: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ON_LEAVE: "On Leave",
};

export default async function StaffPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const staff = await prisma.staff.findMany({
    where: { mosqueId: session.user.mosqueId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/staff" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              People
            </p>
            <h1 className="font-display text-2xl italic">Staff</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <StaffForm />

          <section className="mt-10">
            <h2 className="font-display text-lg italic">All staff</h2>
            <div className="mt-4 overflow-hidden rounded-sm bg-white/40">
              {staff.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                  No staff added yet — add the first one above.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-parchment-dim)] font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Contact</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-parchment-dim)]">
                    {staff.map((s) => (
                      <tr key={s.id}>
                        <td className="px-4 py-3">{s.name}</td>
                        <td className="px-4 py-3 font-mono text-[var(--color-ink)]/70">
                          {roleLabels[s.role] ?? s.role}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/60">
                          {s.phone || s.email || "—"}
                        </td>
                        <td className={`px-4 py-3 font-mono text-xs uppercase ${statusStyles[s.status] ?? ""}`}>
                          {statusLabels[s.status] ?? s.status}
                        </td>
                        <td className="px-4 py-3 text-right font-mono">
                          {formatRs(Number(s.salary))}
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
