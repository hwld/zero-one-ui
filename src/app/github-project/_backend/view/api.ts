import { z } from "zod";
import {
  viewColumnRecordSchema,
  viewRecordSchema,
  viewRecordStore,
  viewTaskRecordSchema,
} from "./view-record-store";
import { taskSchema, taskStore } from "../task/store";
import { taskStatusSchema, taskStatusStore } from "../task-status/store";
import { HttpResponse, delay, http } from "msw";
import { GitHubProjectAPI } from "../api-routes";
import { fetcher } from "../../../../lib/fetcher";

const viewTaskSchema = viewTaskRecordSchema.merge(taskSchema);
const viewColumnSchema = viewColumnRecordSchema.extend(
  z.object({ tasks: z.array(viewTaskSchema), status: taskStatusSchema }).shape,
);
const viewSummarySchema = viewRecordSchema.pick({ id: true, name: true });
const viewSchema = viewSummarySchema.extend(
  z.object({
    columns: z.array(viewColumnSchema),
  }).shape,
);

export type View = z.infer<typeof viewSchema>;
export type ViewSummary = Pick<View, "id" | "name">;
export type ViewColumn = z.infer<typeof viewColumnSchema>;
export type ViewTask = z.infer<typeof viewTaskSchema>;

export const viewFormSchema = z.object({
  name: z
    .string()
    .min(1, "名前の入力は必須です")
    .max(200, "200文字以内で入力してください"),
});
export type ViewFormData = z.infer<typeof viewFormSchema>;

const createViewInputSchema = viewFormSchema;
export type CreateViewInput = z.infer<typeof createViewInputSchema>;

export const createView = async (input: CreateViewInput): Promise<void> => {
  await fetcher.post(GitHubProjectAPI.views(), { body: input });
};

const updateViewInputSchema = viewFormSchema;
export type UpdateViewInput = z.infer<typeof updateViewInputSchema>;

export const updateView = async ({
  id,
  ...input
}: UpdateViewInput & { id: string }): Promise<void> => {
  await fetcher.put(GitHubProjectAPI.view(id), { body: input });
};

export const deleteView = async (viewId: string): Promise<void> => {
  await fetcher.delete(GitHubProjectAPI.view(viewId));
};

export const fetchView = async (id: string): Promise<View> => {
  const res = await fetcher.get(GitHubProjectAPI.view(id));
  const json = await res.json();
  const view = viewSchema.parse(json);

  return view;
};

export const fetchViewSummaries = async (): Promise<ViewSummary[]> => {
  const res = await fetcher.get(GitHubProjectAPI.views());
  const json = await res.json();
  const viewSummaries = z.array(viewSummarySchema).parse(json);

  return viewSummaries;
};

const moveTaskInputSchema = z.object({
  taskId: z.string(),
  statusId: z.string(),
  newOrder: z.coerce.number(),
});
export type MoveTaskInput = z.infer<typeof moveTaskInputSchema>;

export const moveTask = async ({
  viewId,
  ...body
}: MoveTaskInput & { viewId: string }): Promise<undefined> => {
  await fetcher.post(GitHubProjectAPI.moveTask(viewId), { body });
};

const moveColumnInputSchema = z.object({
  statusId: z.string(),
  newOrder: z.coerce.number(),
});
export type MoveColumnInput = z.infer<typeof moveColumnInputSchema>;

export const moveColumn = async ({
  viewId,
  ...body
}: MoveColumnInput & {
  viewId: string;
}) => {
  await fetcher.post(GitHubProjectAPI.moveColumn(viewId), { body });
};

export const viewApiHandler = [
  http.get(GitHubProjectAPI.views(), async () => {
    await delay();

    const summaries: ViewSummary[] = viewRecordStore
      .getAll()
      .map((viewRecord): ViewSummary => {
        return { id: viewRecord.id, name: viewRecord.name };
      });

    return HttpResponse.json(summaries);
  }),

  http.post(GitHubProjectAPI.views(), async ({ request }) => {
    await delay();
    const input = createViewInputSchema.parse(await request.json());

    const allTasks = taskStore.getAll();
    const allStatus = taskStatusStore.getAll();

    viewRecordStore.add({
      name: input.name,
      allTasks,
      allStatus,
    });

    return HttpResponse.json({});
  }),

  http.get(GitHubProjectAPI.view(), async ({ params }) => {
    await delay();
    const viewId = z.string().parse(params.id);

    const viewRecord = viewRecordStore.get(viewId);
    if (!viewRecord) {
      throw new HttpResponse(null, { status: 404 });
    }

    const allStatus = taskStatusStore.getAll();
    const allTasks = taskStore.getAll();

    const columns = viewRecord.columnRecords.map((column): ViewColumn => {
      const status = allStatus.find((s) => s.id === column.statusId);
      if (!status) {
        throw new HttpResponse(null, { status: 404 });
      }

      const tasks: ViewTask[] = viewRecord.taskRecords
        .map((taskRecord): ViewTask | null => {
          const task = allTasks.find(
            (t) => t.id === taskRecord.taskId && t.status.id === status.id,
          );
          if (!task) {
            return null;
          }
          return { ...taskRecord, ...task };
        })
        .filter((task): task is ViewTask => Boolean(task));

      const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

      return {
        ...column,
        status,
        tasks: sortedTasks,
      };
    });
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

    const view: View = {
      id: viewRecord.id,
      name: viewRecord.name,
      columns: sortedColumns,
    };

    return HttpResponse.json(view);
  }),

  http.put(GitHubProjectAPI.view(), async ({ params, request }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    const input = updateViewInputSchema.parse(await request.json());

    viewRecordStore.update({ id: viewId, name: input.name });

    return HttpResponse.json({});
  }),

  http.delete(GitHubProjectAPI.view(), async ({ params }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    viewRecordStore.remove(viewId);

    return HttpResponse.json({});
  }),

  http.post(GitHubProjectAPI.moveTask(), async ({ params, request }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    const updateInput = moveTaskInputSchema.parse(await request.json());

    const targetTask = taskStore.get(updateInput.taskId);
    if (!targetTask) {
      return new HttpResponse(null, { status: 404 });
    }

    if (targetTask.status.id !== updateInput.statusId) {
      const otherViewIds = viewRecordStore
        .getAll()
        .filter((v) => v.id !== viewId)
        .map((v) => v.id);

      viewRecordStore.moveTaskToEndOfStatus({
        viewIds: otherViewIds,
        taskId: targetTask.id,
        targetStatusTaskIds: taskStore
          .getByStatusId(updateInput.statusId)
          .map((t) => t.id),
      });
      taskStore.update({ ...targetTask, statusId: updateInput.statusId });
    }

    viewRecordStore.moveTask({
      viewId,
      taskId: updateInput.taskId,
      newOrder: updateInput.newOrder,
    });

    return HttpResponse.json({});
  }),

  http.post(GitHubProjectAPI.moveColumn(), async ({ params, request }) => {
    await delay();

    const viewId = z.string().parse(params.id);
    const input = moveColumnInputSchema.parse(await request.json());

    viewRecordStore.moveColumn({
      viewId,
      statusId: input.statusId,
      newOrder: input.newOrder,
    });

    return HttpResponse.json({});
  }),
];
