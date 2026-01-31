import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { todo1Tasks } from "./schema";
import type { CreateTaskInput, UpdateTaskInput } from "../api";

/**
 * Todo-1タスクリポジトリ
 *
 * データアクセス層として、DBとの通信を抽象化する。
 */
class Todo1TaskRepository {
  private async getDb() {
    return drizzle(await pgliteManager.getDb());
  }

  public async getAll() {
    const db = await this.getDb();
    const tasks = await db.select().from(todo1Tasks).orderBy(todo1Tasks.createdAt);

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    }));
  }

  public async get(id: string) {
    const db = await this.getDb();
    const tasks = await db
      .select()
      .from(todo1Tasks)
      .where(eq(todo1Tasks.id, id))
      .limit(1);

    if (tasks.length === 0) {
      return undefined;
    }

    const task = tasks[0];
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  public async add(input: CreateTaskInput) {
    const db = await this.getDb();
    const now = new Date();

    const newTasks = await db
      .insert(todo1Tasks)
      .values({
        title: input.title,
        description: "",
        done: false,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const task = newTasks[0];
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  public async update(input: UpdateTaskInput & { id: string }) {
    const db = await this.getDb();
    const now = new Date();

    const updatedTasks = await db
      .update(todo1Tasks)
      .set({
        title: input.title,
        description: input.description,
        done: input.done,
        updatedAt: now,
      })
      .where(eq(todo1Tasks.id, input.id))
      .returning();

    if (updatedTasks.length === 0) {
      return undefined;
    }

    const task = updatedTasks[0];
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  public async remove(id: string) {
    const db = await this.getDb();
    await db.delete(todo1Tasks).where(eq(todo1Tasks.id, id));
  }

  public async clear() {
    const db = await this.getDb();
    await db.delete(todo1Tasks);
  }
}

export const todo1TaskRepository = new Todo1TaskRepository();
