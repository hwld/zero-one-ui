import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.union([z.literal("done"), z.literal("todo")]),
  createdAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});
export type Task = z.infer<typeof taskSchema>;

export const getTaskStatusLabel = (status: Task["status"]) => {
  switch (status) {
    case "done": {
      return "完了";
    }
    case "todo": {
      return "未完了";
    }
    default: {
      throw new Error(status satisfies never);
    }
  }
};
