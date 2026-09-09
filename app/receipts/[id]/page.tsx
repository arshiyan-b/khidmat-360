import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { PrintButton } from "@/components/receipts/print-button";

const categoryLabels: Record<string, string> = {
  GENERAL: "General Donation",
  CONSTRUCTION: "Masjid Construction",
  MAINTENANCE: "Maintenance",
  RAMADAN: "Ramadan",
  ZAKAT: "Zakat",
  FITRAH: "Fitrah",
  OTHER: "Other",
};

function formatRs(value: number) {
  return `Rs ${value.toLocaleString("en-US")}`;
}

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");

  const donation = await prisma.donation.findFirst({
    where: { id, mosqueId: session.user.mosqueId },
    include: { donor: true, mosque: true },
  });

  if (!donation) notFound();

  return (
    <div className="flex flex-1 flex-col items-center bg-[var(--color-ink)] px-6 py-16 print:bg-white print:py-0">
      <div className="w-full max-w-md print:hidden">
        <Link
          href="/receipts"
          className="text-sm text-[var(--color-sage)] hover:text-[var(--color-parchment)]"
        >
          ← Back to receipts
        </Link>
      </div>

      <div className="mt-6 w-full max-w-md rounded-sm bg-[var(--color-parchment)] p-8 shadow-2xl shadow-black/40 print:mt-0 print:shadow-none">
        <div className="border-b border-dashed border-black/20 pb-4 text-center">
          <p className="font-display text-xl italic text-[var(--color-ink)]">
            {donation.mosque.name}
          </p>
          {donation.mosque.address && (
            <p className="mt-1 text-xs text-[var(--color-ink)]/60">{donation.mosque.address}</p>
          )}
          {(donation.mosque.phone || donation.mosque.email) && (
            <p className="mt-1 text-xs text-[var(--color-ink)]/60">
              {[donation.mosque.phone, donation.mosque.email].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-3 font-mono text-sm">
          <Row label="Receipt No." value={donation.receiptNumber ?? "—"} />
          <Row label="Date" value={donation.donationDate.toLocaleDateString("en-GB")} />
          <Row label="Donor" value={donation.donor?.name ?? "Anonymous"} />
          <Row
            label="Purpose"
            value={categoryLabels[donation.category] ?? donation.category}
          />
          <Row label="Payment Method" value={donation.paymentMethod.replaceAll("_", " ")} />
          {donation.purpose && <Row label="Note" value={donation.purpose} />}
        </div>

        <div className="mt-5 border-t border-dashed border-black/20 pt-4 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-ink)]/50">
            Amount
          </p>
          <p className="mt-1 font-display text-3xl italic text-[#8a6117]">
            {formatRs(Number(donation.amount))}
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-ink)]/50">
          جزاك الله خيرا — May Allah reward you for your generosity.
        </p>
      </div>

      <div className="mt-6">
        <PrintButton />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[var(--color-ink)]/50">{label}</span>
      <span className="text-right text-[var(--color-ink)]">{value}</span>
    </div>
  );
}
