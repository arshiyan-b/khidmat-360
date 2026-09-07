import { z } from "zod";

export const mosqueSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  address: z.string().trim().max(200).optional().or(z.literal("")),
});

export type MosqueInput = z.infer<typeof mosqueSchema>;
