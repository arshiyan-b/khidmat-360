"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { mosqueSchema, type MosqueInput } from "@/lib/validations/mosque";

export async function updateMosque(input: MosqueInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (!session.user.mosqueId) redirect("/dashboard/setup");

  const parsed = mosqueSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { name, address, city, phone, email } = parsed.data;

  await prisma.mosque.update({
    where: { id: session.user.mosqueId },
    data: {
      name,
      address: address || null,
      city: city || null,
      phone: phone || null,
      email: email || null,
    },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return { success: true as const };
}
