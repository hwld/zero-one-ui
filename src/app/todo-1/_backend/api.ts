import { HttpResponse, delay, http } from "msw";
import { z } from "zod";
import { Task, taskSchema } from "./types";
import { fetcher } from "../../../lib/fetcher";
import { todo1TaskRepository } from "./db/repository";

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .min(1, "タスクのタイトルを入力してください")
    .max(100, "タスクのタイトルは100文字以内で入力してください"),
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z.object({
  title: z
    .string()
    .min(1, "タスクのタイトルを入力してください")
    .max(100, "タスクのタイトルは100文字以内で入力してください"),
  description: z
    .string()
    .max(10000, "タスクの説明は10000文字以内で入力してください"),
  done: z.boolean(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const Todo1API = {
  base: "/todo-1/api",
  tasks: () => `${Todo1API.base}/tasks`,
  task: (id?: string) => `${Todo1API.base}/tasks/${id ?? ":id"}`,
};

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetcher.get(Todo1API.tasks());
  const json = await res.json();
  const tasks = z.array(taskSchema).parse(json);

  return tasks;
};

export const fetchTask = async (id: string): Promise<Task | undefined> => {
  const res = await fetcher.get(Todo1API.task(id));
  const json = await res.json();
  const task = taskSchema.optional().parse(json);

  return task;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await fetcher.post(Todo1API.tasks(), { body: input });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const updateTask = async ({
  id,
  ...input
}: UpdateTaskInput & { id: string }): Promise<Task | undefined> => {
  const res = await fetcher.put(Todo1API.task(id), { body: input });
  const json = await res.json();
  const task = taskSchema.optional().parse(json);

  return task;
};

export const deleteTask = async (id: string) => {
  await fetcher.delete(Todo1API.task(id));
  return;
};

export const todo1Handlers = [
  http.get(Todo1API.tasks(), async () => {
    await delay();
    const tasks = await todo1TaskRepository.getAll();

    return HttpResponse.json(tasks);
  }),

  http.get(Todo1API.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params.id);
    const task = await todo1TaskRepository.get(id);

    return HttpResponse.json(task);
  }),

  http.post(Todo1API.tasks(), async ({ request }) => {
    await delay();
    const input = createTaskInputSchema.parse(await request.json());
    const createdTask = await todo1TaskRepository.add(input);

    return HttpResponse.json(createdTask);
  }),

  http.put(Todo1API.task(), async ({ params, request }) => {
    await delay();
    const id = z.string().parse(params.id);
    const input = updateTaskInputSchema.parse(await request.json());
    const updatedTask = await todo1TaskRepository.update({ ...input, id });

    return HttpResponse.json(updatedTask);
  }),

  http.delete(Todo1API.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params.id);
    await todo1TaskRepository.remove(id);

    return HttpResponse.json({});
  }),
];
