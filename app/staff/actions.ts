"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { staffSchema, type StaffInput } from "@/lib/validations/staff";

async function requireStaffAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");
  return session;
}

export async function createStaff(input: StaffInput) {
  const session = await requireStaffAccess();
  const mosqueId = session.user.mosqueId as string;

  const parsed = staffSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { name, role, phone, email, salary, status } = parsed.data;

  await prisma.staff.create({
    data: {
      mosqueId,
      name,
      role,
      phone: phone || null,
      email: email || null,
      salary,
      status,
    },
  });

  revalidatePath("/staff");
  revalidatePath("/salaries");

  return { success: true as const };
}
