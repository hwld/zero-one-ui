import { seedTodo1 } from "../../app/todo-1/_backend/db/seed";

/**
 * 全アプリのシードデータを投入する
 */
export async function seedAllData(): Promise<void> {
  await seedTodo1();
  console.log("All seed data completed");
}
