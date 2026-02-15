import { drizzle } from "drizzle-orm/pglite";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { initialTasks } from "../data";
import { todo2Tasks } from "./schema";

/**
 * Todo-2のデータをリセットする
 */
export async function resetTodo2Data(): Promise<void> {
  try {
    const db = drizzle(await pgliteManager.getDb());

    await db.delete(todo2Tasks);

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

    console.log("Todo-2 data reset completed");
  } catch (error) {
    console.error("Failed to reset Todo-2 data:", error);
    throw error;
  }
}
