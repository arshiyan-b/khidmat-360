"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { mosqueSchema, type MosqueInput } from "@/lib/validations/mosque";

export async function createMosque(input: MosqueInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (session.user.mosqueId) redirect("/dashboard");

  const parsed = mosqueSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const mosque = await prisma.mosque.create({
    data: {
      name: parsed.data.name,
      address: parsed.data.address || null,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { mosqueId: mosque.id },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
