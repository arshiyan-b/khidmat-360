import { z } from "zod";

export const donationCategories = [
  "GENERAL",
  "CONSTRUCTION",
  "MAINTENANCE",
  "RAMADAN",
  "ZAKAT",
  "FITRAH",
  "OTHER",
] as const;

export const paymentMethods = [
  "CASH",
  "BANK_TRANSFER",
  "CARD",
  "ONLINE",
  "OTHER",
] as const;

export const donationSchema = z.object({
  donorName: z.string().trim().max(120).optional().or(z.literal("")),
  amount: z
    .number({ error: "Enter an amount" })
    .positive("Amount must be greater than zero"),
  category: z.enum(donationCategories),
  paymentMethod: z.enum(paymentMethods),
  purpose: z.string().trim().max(200).optional().or(z.literal("")),
});

export type DonationInput = z.infer<typeof donationSchema>;
