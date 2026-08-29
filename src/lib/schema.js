import { z } from 'zod';

export const stopSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.string().optional(),
  type: z.enum(['attraction', 'food', 'transport', 'hotel']).catch('attraction'),
  tips: z.string().optional()
});

export const daySchema = z.object({
  dayNumber: z.number(),
  title: z.string(),
  stops: z.array(stopSchema)
});

export const itinerarySchema = z.object({
  title: z.string(),
  summary: z.string(),
  days: z.array(daySchema)
});
