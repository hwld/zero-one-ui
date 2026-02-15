import { and, eq, inArray, ne } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { pgliteManager } from "../../../../lib/pglite-manager";
import type { CreateTaskInput, UpdateTaskInput } from "../api";
import type { Task } from "../models";
import { todo2ErrorSimulator } from "../error-simulator";
import { todo2Tasks, type Todo2TaskRow } from "./schema";

class Todo2TaskRepository {
  private async getDb() {
    return drizzle(await pgliteManager.getDb());
  }

  private toTask(task: Todo2TaskRow): Task {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      createdAt: task.createdAt,
      completedAt: task.completedAt ?? undefined,
    };
  }

  public async getAll(): Promise<Task[]> {
    todo2ErrorSimulator.throwIfScopeActive("getAll");
    const db = await this.getDb();
    const tasks = await db
      .select()
      .from(todo2Tasks)
      .orderBy(todo2Tasks.createdAt);

    return tasks.map((task) => this.toTask(task));
  }

  public async get(id: string): Promise<Task | undefined> {
    todo2ErrorSimulator.throwIfScopeActive("get");
    const db = await this.getDb();
    const tasks = await db
      .select()
      .from(todo2Tasks)
      .where(eq(todo2Tasks.id, id))
      .limit(1);

    if (tasks.length === 0) {
      return undefined;
    }

    return this.toTask(tasks[0]);
  }

  public async add(input: CreateTaskInput): Promise<Task> {
    const db = await this.getDb();
    const now = new Date();

    const insertedTasks = await db
      .insert(todo2Tasks)
      .values({
        title: input.title,
        description: input.description,
        status: "todo",
        createdAt: now,
        completedAt: null,
      })
      .returning();

    return this.toTask(insertedTasks[0]);
  }

  public async update(
    input: UpdateTaskInput & { id: string },
  ): Promise<Task | undefined> {
    const db = await this.getDb();
    const completedAt = input.status === "done" ? new Date() : null;

    const updatedTasks = await db
      .update(todo2Tasks)
      .set({
        title: input.title,
        description: input.description,
        status: input.status,
        completedAt: completedAt,
      })
      .where(eq(todo2Tasks.id, input.id))
      .returning();

    if (updatedTasks.length === 0) {
      return undefined;
    }

    return this.toTask(updatedTasks[0]);
  }

  public async updateTaskStatuses(input: {
    status: Task["status"];
    selectedTaskIds: string[];
  }): Promise<void> {
    if (input.selectedTaskIds.length === 0) {
      return;
    }

    const db = await this.getDb();
    const completedAt = input.status === "done" ? new Date() : null;

    await db
      .update(todo2Tasks)
      .set({
        status: input.status,
        completedAt: completedAt,
      })
      .where(
        and(
          inArray(todo2Tasks.id, input.selectedTaskIds),
          ne(todo2Tasks.status, input.status),
        ),
      );
  }

  public async remove(targetIds: string[]): Promise<void> {
    if (targetIds.length === 0) {
      return;
    }

    const db = await this.getDb();
    await db.delete(todo2Tasks).where(inArray(todo2Tasks.id, targetIds));
  }

  public async clear(): Promise<void> {
    const db = await this.getDb();
    await db.delete(todo2Tasks);
  }
}

export const todo2TaskRepository = new Todo2TaskRepository();
