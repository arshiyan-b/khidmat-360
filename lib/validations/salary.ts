import { z } from "zod";

export const markSalaryPaidSchema = z.object({
  staffId: z.string().min(1),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export type MarkSalaryPaidInput = z.infer<typeof markSalaryPaidSchema>;
