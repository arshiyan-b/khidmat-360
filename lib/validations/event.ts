import { z } from "zod";

export const eventCategories = [
  "JUMMAH",
  "TARAWEEH",
  "EID",
  "QURAN_CLASS",
  "LECTURE",
  "FUNDRAISING",
  "OTHER",
] as const;

export const eventSchema = z
  .object({
    title: z.string().trim().min(2, "Title is too short").max(120),
    category: z.enum(eventCategories),
    description: z.string().trim().max(300).optional().or(z.literal("")),
    startsAt: z.date({ error: "Pick a start date and time" }),
    endsAt: z.date().optional(),
  })
  .refine((data) => !data.endsAt || data.endsAt > data.startsAt, {
    message: "End time must be after the start time",
    path: ["endsAt"],
  });

export type EventInput = z.infer<typeof eventSchema>;
