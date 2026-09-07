import { z } from "zod";

export const expenseCategories = [
  "ELECTRICITY",
  "WATER",
  "GAS",
  "CLEANING",
  "MAINTENANCE",
  "CONSTRUCTION",
  "SALARIES",
  "SECURITY",
  "OTHER",
] as const;

export const expenseSchema = z.object({
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Amount must be greater than zero"),
  category: z.enum(expenseCategories),
  description: z.string().trim().max(200).optional().or(z.literal("")),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
