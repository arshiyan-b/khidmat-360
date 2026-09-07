"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { eventSchema, type EventInput } from "@/lib/validations/event";

async function requireEventAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  // Events aren't in the Accountant's access list (Donations, Expenses,
  // Reports, Receipts, Staff) — Admin-only, same as the original spec.
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (!session.user.mosqueId) redirect("/setup");
  return session;
}

export async function createEvent(input: EventInput) {
  const session = await requireEventAccess();
  const mosqueId = session.user.mosqueId as string;

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { title, category, description, startsAt, endsAt } = parsed.data;

  await prisma.event.create({
    data: {
      mosqueId,
      title,
      category,
      description: description || null,
      startsAt,
      endsAt: endsAt ?? null,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard");

  return { success: true as const };
}
