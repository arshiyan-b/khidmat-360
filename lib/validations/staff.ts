import { z } from "zod";

export const staffRoles = [
  "IMAM",
  "MUAZZIN",
  "TEACHER",
  "CLEANER",
  "SECURITY",
  "OTHER",
] as const;

export const staffStatuses = ["ACTIVE", "INACTIVE", "ON_LEAVE"] as const;

export const staffSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(120),
  role: z.enum(staffRoles),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  salary: z
    .number({ error: "Enter a salary amount" })
    .positive("Salary must be greater than zero"),
  status: z.enum(staffStatuses),
});

export type StaffInput = z.infer<typeof staffSchema>;
