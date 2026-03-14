import { delay, http, HttpResponse } from "msw";
import {
  taskFormSchema,
  updateTaskDoneSchema,
  type TaskFormData,
  type UpdateTaskDoneInput,
} from "./schema";
import { TodoistAPI } from "../routes";
import { fetcher } from "../../../../lib/fetcher";
import { taskRepository } from "./repository";
import { z } from "zod";
import {
  taskSchema,
  validateCreateInput,
  validateDeleteInput,
  validateUpdateInput,
  validateUpdateTaskDone,
  type Task,
} from "./model";
import { taskboxRepository } from "../taskbox/repository";

export const fetchTask = async (id: string): Promise<Task> => {
  const res = await fetcher.get(TodoistAPI.task(id));
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const createTask = async (input: TaskFormData): Promise<void> => {
  await fetcher.post(TodoistAPI.tasks(), { body: input });
};

export const updateTask = async ({
  id,
  ...input
}: TaskFormData & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.task(id), { body: input });
};

export const updateTaskDone = async ({
  id,
  ...body
}: UpdateTaskDoneInput & { id: string }): Promise<void> => {
  await fetcher.patch(TodoistAPI.updateTaskDone(id), { body });
};

export const deleteTask = async (id: string): Promise<void> => {
  await fetcher.delete(TodoistAPI.task(id));
};

export const taskApiHandlers = [
  http.post(TodoistAPI.tasks(), async ({ request }) => {
    await delay();
    const input = taskFormSchema.parse(await request.json());

    const validatedInput = validateCreateInput(input, {
      getTask: taskRepository.get,
      getTaskbox: taskboxRepository.get,
    });

    taskRepository.add(validatedInput);

    return HttpResponse.json({});
  }),

  http.get(TodoistAPI.task(), async ({ params }) => {
    await delay();
    const taskId = z.string().parse(params.id);

    const task = taskRepository.get(taskId);
    if (!task) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(task);
  }),

  http.patch(TodoistAPI.task(), async ({ request, params }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const input = taskFormSchema.parse(await request.json());

    const validatedInput = validateUpdateInput(
      { id: taskId, ...input },
      {
        getTask: taskRepository.get,
        getTaskbox: taskboxRepository.get,
      },
    );

    taskRepository.update(validatedInput);

    return HttpResponse.json({});
  }),

  http.patch(TodoistAPI.updateTaskDone(), async ({ params, request }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const input = updateTaskDoneSchema.parse(await request.json());

    const validatedInput = validateUpdateTaskDone(
      { id: taskId, ...input },
      { getTask: taskRepository.get },
    );

    taskRepository.updateTaskDone(validatedInput);

    return HttpResponse.json({});
  }),

  http.delete(TodoistAPI.task(), async ({ params }) => {
    await delay();
    const taskId = z.string().parse(params.id);

    const validatedInput = validateDeleteInput({ id: taskId }, { getTask: taskRepository.get });

    taskRepository.delete(validatedInput);

    return HttpResponse.json({});
  }),
];
