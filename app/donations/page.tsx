import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { DonationForm } from "@/components/donations/donation-form";

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

const categoryLabels: Record<string, string> = {
  GENERAL: "General Donation",
  CONSTRUCTION: "Masjid Construction",
  MAINTENANCE: "Maintenance",
  RAMADAN: "Ramadan",
  ZAKAT: "Zakat",
  FITRAH: "Fitrah",
  OTHER: "Other",
};

export default async function DonationsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const donations = await prisma.donation.findMany({
    where: { mosqueId: session.user.mosqueId },
    orderBy: { donationDate: "desc" },
    take: 50,
    include: { donor: true },
  });

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/donations" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Ledger
            </p>
            <h1 className="font-display text-2xl italic">Donations</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <DonationForm />

          <section className="mt-10">
            <h2 className="font-display text-lg italic">All donations</h2>
            <div className="mt-4 overflow-hidden rounded-sm bg-white/40">
              {donations.length === 0 ? (
                <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                  No donations recorded yet — add the first one above.
                </p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-parchment-dim)] font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                      <th className="px-4 py-3 font-medium">Receipt</th>
                      <th className="px-4 py-3 font-medium">Donor</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-parchment-dim)]">
                    {donations.map((d) => (
                      <tr key={d.id} className="font-mono">
                        <td className="px-4 py-3 text-[var(--color-ink)]/70">
                          {d.receiptNumber ?? "—"}
                        </td>
                        <td className="px-4 py-3">{d.donor?.name ?? "Anonymous"}</td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/70">
                          {categoryLabels[d.category] ?? d.category}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/70">
                          {d.paymentMethod.replaceAll("_", " ")}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-ink)]/50">
                          {d.donationDate.toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-right text-[#8a6117]">
                          {formatRs(Number(d.amount))}
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
