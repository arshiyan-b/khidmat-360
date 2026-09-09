"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import {
  markSalaryPaidSchema,
  type MarkSalaryPaidInput,
} from "@/lib/validations/salary";

async function requireSalaryAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");
  return session;
}

export async function markSalaryPaid(input: MarkSalaryPaidInput) {
  const session = await requireSalaryAccess();
  const mosqueId = session.user.mosqueId as string;

  const parsed = markSalaryPaidSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { staffId, month, year } = parsed.data;

  // Look up the amount ourselves rather than trusting the client, and
  // confirm this staff member actually belongs to the caller's mosque.
  const staff = await prisma.staff.findFirst({ where: { id: staffId, mosqueId } });
  if (!staff) {
    return { success: false as const, error: "Staff member not found." };
  }

  await prisma.salaryPayment.upsert({
    where: { staffId_month_year: { staffId, month, year } },
    create: {
      staffId,
      month,
      year,
      amount: staff.salary,
      status: "PAID",
      paymentDate: new Date(),
    },
    update: {
      status: "PAID",
      amount: staff.salary,
      paymentDate: new Date(),
    },
  });

  revalidatePath("/salaries");
  revalidatePath("/dashboard");

  return { success: true as const };
}
