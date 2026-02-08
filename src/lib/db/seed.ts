import { seedTodo1 } from "../../app/todo-1/_backend/db/seed";
import { seedTodo2 } from "../../app/todo-2/_backend/db/seed";

/**
 * 全アプリのシードデータを投入する
 */
export async function seedAllData(): Promise<void> {
  await seedTodo1();
  await seedTodo2();
  console.log("All seed data completed");
}
