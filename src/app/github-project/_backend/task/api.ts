import { z } from "zod";
import { Task, taskSchema, taskStore } from "./store";
import { HttpResponse, delay, http } from "msw";
import { GitHubProjectAPI } from "../api-routes";
import { taskStatusStore } from "../task-status/store";
import { viewRecordStore } from "../view/view-record-store";
import { fetcher } from "../../../../lib/fetcher";

export const fetchTask = async (id: string): Promise<Task> => {
  const res = await fetcher.get(GitHubProjectAPI.task(id));
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルの入力は必須です")
    .max(256, "256文字以内で入力してください"),
  statusId: z.string(),
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await fetcher.post(GitHubProjectAPI.tasks(), { body: input });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const deleteTask = async (id: string) => {
  await fetcher.delete(GitHubProjectAPI.task(id));
};

export const updateTaskInputSchema = createTaskInputSchema.extend(
  z.object({
    comment: z.string().max(1000, "1000文字以内で入力してください"),
  }).shape,
);

export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTask = async ({
  id,
  ...input
}: UpdateTaskInput & { id: string }) => {
  const res = await fetcher.put(GitHubProjectAPI.task(id), { body: input });
  const json = await res.json();
  const updated = taskSchema.parse(json);

  return updated;
};

export const taskApiHandler = [
  http.get(GitHubProjectAPI.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params.id);
    const task = taskStore.get(id);

    return HttpResponse.json(task);
  }),

  http.post(GitHubProjectAPI.tasks(), async ({ request }) => {
    await delay();
    const input = createTaskInputSchema.parse(await request.json());

    const status = taskStatusStore.get(input.statusId);
    if (!status) {
      throw new Error("存在しないステータス");
    }

    const createdTask = taskStore.add({ title: input.title, status });
    viewRecordStore.addTaskToAllRecords({
      taskId: createdTask.id,
      statusId: createdTask.status.id,
      sameStatusTaskIds: taskStore
        .getByStatusId(createdTask.status.id)
        .map((t) => t.id),
    });

    return HttpResponse.json(createdTask);
  }),

  http.put(GitHubProjectAPI.task(), async ({ params, request }) => {
    await delay();
    const taskId = z.string().parse(params.id);
    const updateInput = updateTaskInputSchema.parse(await request.json());

    const targetTask = taskStore.get(taskId);
    if (!targetTask) {
      return new HttpResponse(null, { status: 404 });
    }

    if (targetTask.status.id !== updateInput.statusId) {
      const allViweIds = viewRecordStore.getAll().map((v) => v.id);

      viewRecordStore.moveTaskToEndOfStatus({
        viewIds: allViweIds,
        taskId,
        targetStatusTaskIds: taskStore
          .getByStatusId(updateInput.statusId)
          .map((t) => t.id),
      });
    }

    const updatedTask = taskStore.update({
      id: taskId,
      title: updateInput.title,
      comment: updateInput.comment,
      statusId: updateInput.statusId,
    });

    return HttpResponse.json(updatedTask);
  }),

  http.delete(GitHubProjectAPI.task(), async ({ params }) => {
    await delay();
    const id = z.string().parse(params?.id);

    taskStore.remove(id);
    viewRecordStore.removeTaskFromAllRecords(id);

    return HttpResponse.json({});
  }),
];
