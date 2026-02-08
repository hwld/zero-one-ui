import { pgTableCreator, text, timestamp, uuid } from "drizzle-orm/pg-core";

type TaskStatus = "done" | "todo";

const todo2Table = pgTableCreator((name) => `todo2_${name}`);

export const todo2Tasks = todo2Table("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status").$type<TaskStatus>().notNull().default("todo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type Todo2TaskRow = typeof todo2Tasks.$inferSelect;
