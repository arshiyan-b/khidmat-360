"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { expenseSchema, type ExpenseInput } from "@/lib/validations/expense";

async function requireExpenseAccess() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN" && session.user.role !== "ACCOUNTANT") {
    redirect("/unauthorized");
  }
  if (!session.user.mosqueId) redirect("/setup");
  return session;
}

export async function createExpense(input: ExpenseInput) {
  const session = await requireExpenseAccess();
  const mosqueId = session.user.mosqueId as string;

  const parsed = expenseSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0]?.message };
  }

  const { amount, category, description } = parsed.data;

  await prisma.expense.create({
    data: {
      mosqueId,
      amount,
      category,
      description: description || null,
    },
  });

  revalidatePath("/expenses");
  revalidatePath("/dashboard");

  return { success: true as const };
}
