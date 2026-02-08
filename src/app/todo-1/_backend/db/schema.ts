import {
  boolean,
  pgTableCreator,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

const todo1Table = pgTableCreator((name) => `todo1_${name}`);

export const todo1Tasks = todo1Table("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Todo1TaskRow = typeof todo1Tasks.$inferSelect;
