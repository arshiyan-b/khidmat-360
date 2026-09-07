import { z } from "zod";

export const mosqueSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
});

export type MosqueInput = z.infer<typeof mosqueSchema>;
