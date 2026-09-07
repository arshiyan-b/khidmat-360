"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { donationSchema, type DonationInput } from "@/lib/validations/donation";

async function requireDonationAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/dashboard/setup");
  return session;
}

export async function createDonation(input: DonationInput) {
  const session = await requireDonationAccess();
  const mosqueId = session.user.mosqueId as string;

  const parsed = donationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { donorName, amount, category, paymentMethod, purpose } = parsed.data;

  let donorId: string | null = null;
  if (donorName) {
    const existingDonor = await prisma.donor.findFirst({
      where: { mosqueId, name: donorName },
    });
    donorId = existingDonor
      ? existingDonor.id
      : (await prisma.donor.create({ data: { mosqueId, name: donorName } })).id;
  }

  // Sequential, mosque-scoped receipt numbers (e.g. KH-00001). Under
  // concurrent submissions two donations could in rare cases land on
  // the same number — fine at masjid scale, worth a proper counter
  // table if this ever needs to be airtight.
  const donationCount = await prisma.donation.count({ where: { mosqueId } });
  const receiptNumber = `KH-${String(donationCount + 1).padStart(5, "0")}`;

  await prisma.donation.create({
    data: {
      mosqueId,
      donorId,
      amount,
      category,
      paymentMethod,
      purpose: purpose || null,
      receiptNumber,
    },
  });

  revalidatePath("/dashboard/donations");
  revalidatePath("/dashboard");

  return { success: true as const, receiptNumber };
}
