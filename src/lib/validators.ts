import { z } from 'zod';

export const IntakeSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  notes: z.string().optional(),
  igUserId: z.string().optional(),
  igUsername: z.string().optional(),
  igCommentId: z.string().optional(),
  igMediaId: z.string().optional(),
  campaign: z.string().optional(),
});

export type IntakeData = z.infer<typeof IntakeSchema>;
