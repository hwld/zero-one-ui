import { z, type BRAND } from "zod";
import type { Taskbox } from "../taskbox/model";

export type Task = {
  id: string;
  done: boolean;
  parentId: string | null;
  title: string;
  description: string;
  // TODO: Taskとは別に持たせたい
  order: number;
  subTasks: Task[];
  taskboxId: string;
};

export const taskSchema: z.ZodType<Task> = z.object({
  id: z.string(),
  done: z.boolean(),
  parentId: z.string().nullable(),
  title: z.string(),
  description: z.string(),
  order: z.number(),
  subTasks: z.lazy(() => taskSchema.array()),
  taskboxId: z.string(),
});

type CreateInput = {
  title: string;
  description: string;
  order?: number;
  parentId: string | null;
  taskboxId: string;
};
export type ValidatedCreateInput = CreateInput & BRAND<"CreateInput">;

export const validateCreateInput = (
  input: CreateInput,
  {
    getTask,
    getTaskbox,
  }: {
    getTask: (id: string) => Task | undefined;
    getTaskbox: (id: string) => Taskbox | undefined;
  },
): ValidatedCreateInput => {
  if (input.parentId) {
    const parent = getTask(input.parentId);
    if (!parent) {
      throw new Error(`親タスクが見つかりません id:${input.parentId}`);
    }
  }

  const taskbox = getTaskbox(input.taskboxId);
  if (!taskbox) {
    throw new Error(`タスクの保存先が見つかりません taskboxId:${input.taskboxId}`);
  }

  return input as ValidatedCreateInput;
};

type UpdateInput = {
  id: string;
  title: string;
  description: string;
  taskboxId: string;
};
export type ValidatedUpdateInput = UpdateInput & BRAND<"UpdateInput">;

export const validateUpdateInput = (
  input: UpdateInput,
  {
    getTask,
    getTaskbox,
  }: {
    getTask: (id: string) => Task | undefined;
    getTaskbox: (id: string) => Taskbox | undefined;
  },
): ValidatedUpdateInput => {
  const task = getTask(input.id);
  if (!task) {
    throw new Error(`タスクが見つかりません id:${input.id}`);
  }

  const taskbox = getTaskbox(input.taskboxId);
  if (!taskbox) {
    throw new Error(`タスクの保存先が見つかりません id:${input.taskboxId}`);
  }

  return input as ValidatedUpdateInput;
};

type UpdateTaskDoneInput = { id: string; done: boolean };
export type ValidatedUpdateTaskDoneInput = UpdateTaskDoneInput & BRAND<"UpdateTsakDone">;

export const validateUpdateTaskDone = (
  input: UpdateTaskDoneInput,
  { getTask }: { getTask: (id: string) => Task | undefined },
): ValidatedUpdateTaskDoneInput => {
  const task = getTask(input.id);
  if (!task) {
    throw new Error(`タスクが見つかりません id:${input.id}`);
  }

  return input as ValidatedUpdateTaskDoneInput;
};

type DeleteInput = { id: string };
export type ValidatedDeleteInput = DeleteInput & BRAND<"DeleteInput">;

export const validateDeleteInput = (
  input: DeleteInput,
  { getTask }: { getTask: (id: string) => Task | undefined },
): ValidatedDeleteInput => {
  const task = getTask(input.id);
  if (!task) {
    throw new Error(`タスクが見つかりません id:${input.id}`);
  }

  return input as ValidatedDeleteInput;
};
