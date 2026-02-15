import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  done: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Task = z.infer<typeof taskSchema>;
