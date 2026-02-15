import { drizzle } from "drizzle-orm/pglite";
import { eq } from "drizzle-orm";
import { pgliteManager } from "../../../../lib/pglite-manager";
import { todo1Tasks, type Todo1TaskRow } from "./schema";
import type { CreateTaskInput, UpdateTaskInput } from "../api";
import type { Task } from "../models";
import { errorSimulator } from "../error-simulator";

/**
 * Todo-1タスクリポジトリ
 *
 * データアクセス層として、DBとの通信を抽象化する。
 */
class Todo1TaskRepository {
  private async getDb() {
    return drizzle(await pgliteManager.getDb());
  }

  private toTask(task: Todo1TaskRow): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      done: task.done,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  public async getAll(): Promise<Task[]> {
    errorSimulator.throwIfActive();
    const db = await this.getDb();
    const tasks = await db
      .select()
      .from(todo1Tasks)
      .orderBy(todo1Tasks.createdAt);

    return tasks.map((task) => this.toTask(task));
  }

  public async get(id: string): Promise<Task | undefined> {
    errorSimulator.throwIfActive();
    const db = await this.getDb();
    const tasks = await db
      .select()
      .from(todo1Tasks)
      .where(eq(todo1Tasks.id, id))
      .limit(1);

    if (tasks.length === 0) {
      return undefined;
    }

    return this.toTask(tasks[0]);
  }

  public async add(input: CreateTaskInput): Promise<Task> {
    errorSimulator.throwIfActive();
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

    return this.toTask(newTasks[0]);
  }

  public async update(
    input: UpdateTaskInput & { id: string },
  ): Promise<Task | undefined> {
    errorSimulator.throwIfActive();
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

    return this.toTask(updatedTasks[0]);
  }

  public async remove(id: string): Promise<void> {
    errorSimulator.throwIfActive();
    const db = await this.getDb();
    await db.delete(todo1Tasks).where(eq(todo1Tasks.id, id));
  }

  public async clear(): Promise<void> {
    const db = await this.getDb();
    await db.delete(todo1Tasks);
  }
}

export const todo1TaskRepository = new Todo1TaskRepository();
