import { drizzle } from "drizzle-orm/pglite";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { todo1Tasks } from "./schema";
import { initialTasks } from "../data";

/**
 * Todo-1のシードデータを投入する
 */
export async function seedTodo1(): Promise<void> {
  const db = drizzle(await pgliteManager.getRawDb());

  // テーブルが空の場合のみシードデータを投入（重複エラー回避）
  const existingTasks = await db.select().from(todo1Tasks).limit(1);
  if (existingTasks.length > 0) {
    console.log("Todo-1 tasks already seeded, skipping");
    return;
  }

  const tasksToInsert = initialTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    done: task.done,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  }));

  if (tasksToInsert.length > 0) {
    await db.insert(todo1Tasks).values(tasksToInsert);
  }

  console.log(`Seeded ${tasksToInsert.length} todo-1 tasks`);
}
