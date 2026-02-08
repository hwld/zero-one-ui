import { drizzle } from "drizzle-orm/pglite";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { initialTasks } from "../data";
import { todo2Tasks } from "./schema";

/**
 * Todo-2のシードデータを投入する
 */
export async function seedTodo2(): Promise<void> {
  const db = drizzle(await pgliteManager.getRawDb());

  const existingTasks = await db.select().from(todo2Tasks).limit(1);
  if (existingTasks.length > 0) {
    console.log("Todo-2 tasks already seeded, skipping");
    return;
  }

  const tasksToInsert = initialTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: new Date(task.createdAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : null,
  }));

  if (tasksToInsert.length > 0) {
    await db.insert(todo2Tasks).values(tasksToInsert);
  }

  console.log(`Seeded ${tasksToInsert.length} todo-2 tasks`);
}
