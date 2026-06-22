import { z } from "zod";

export const rawSearchSchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  rooms: z.coerce.number().int().min(1).max(8),
  adults: z.coerce.number().int().min(1).max(12),
  childrenAges: z.array(z.number().int().min(0).max(17)).max(8),
});