import { drizzle } from "drizzle-orm/pglite";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { todo1Tasks } from "./schema";
import { initialTasks } from "../data";

/**
 * Todo-1のデータをリセットする
 */
export async function resetTodo1Data(): Promise<void> {
  try {
    const db = drizzle(await pgliteManager.getDb());

    await db.delete(todo1Tasks);

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

    console.log("Todo-1 data reset completed");
  } catch (error) {
    console.error("Failed to reset Todo-1 data:", error);
    throw error;
  }
}
