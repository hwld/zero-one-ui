import { z } from "zod";
import { TaskStatus, taskStatusSchema, taskStatusStore } from "../task-status/store";
import { initialTasks } from "./data";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  comment: z.string(),
  status: taskStatusSchema,
});

export type Task = z.infer<typeof taskSchema>;

type TaskStoreErrorSimulationScope = "getAll" | "mutation";

class TaskStore {
  private tasks: Task[] = initialTasks;
  private errorSimulationScopes: Set<TaskStoreErrorSimulationScope> = new Set();

  private throwErrorForScope(scope: TaskStoreErrorSimulationScope) {
    if (this.errorSimulationScopes.has(scope)) {
      throw new Error("simulated error");
    }
  }

  public getAll(): Task[] {
    this.throwErrorForScope("getAll");
    return this.tasks;
  }

  public get(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  public getByStatusId(statusId: string): Task[] {
    return this.tasks.filter((t) => t.status.id === statusId);
  }

  public add(input: { title: string; status: TaskStatus }): Task {
    this.throwErrorForScope("mutation");

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: input.title,
      comment: "",
      status: input.status,
    };
    this.tasks = [...this.tasks, newTask];

    return newTask;
  }

  public update(input: { id: string; title: string; comment: string; statusId: string }) {
    this.throwErrorForScope("mutation");

    const status = taskStatusStore.get(input.statusId);
    if (!status) {
      throw new Error("statusが存在しません");
    }

    let updatedTask: Task | undefined;
    this.tasks = this.tasks.map((t) => {
      if (t.id === input.id) {
        updatedTask = {
          ...t,
          title: input.title,
          comment: input.comment,
          status,
        };
        return updatedTask;
      }
      return t;
    });

    if (!updatedTask) {
      throw new Error("taskが存在しません");
    }

    return updatedTask;
  }

  public remove(id: string) {
    this.throwErrorForScope("mutation");

    this.tasks = this.tasks.filter((t) => t.id !== id);
  }

  public addErrorSimulationScope(scope: TaskStoreErrorSimulationScope) {
    this.errorSimulationScopes.add(scope);
  }

  public removeErrorSimulationScope(scope: TaskStoreErrorSimulationScope) {
    this.errorSimulationScopes.delete(scope);
  }

  public stopErrorSimulation() {
    this.errorSimulationScopes.clear();
  }
}

export const taskStore = new TaskStore();
