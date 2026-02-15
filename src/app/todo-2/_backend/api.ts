"use client";
import { HttpResponse, http } from "msw";
import { paginate } from "../_lib/utils";
import { z } from "zod";
import { Task, taskSchema } from "./models";
import { fetcher } from "../../../lib/fetcher";
import { todo2TaskRepository } from "./db/repository";

const sortOrderSchema = z.union([z.literal("asc"), z.literal("desc")]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

const sortEntrySchema = z.object({
  field: z.union([
    z.literal("title"),
    z.literal("createdAt"),
    z.literal("completedAt"),
  ]),
  order: sortOrderSchema,
});
export type SortEntry = z.infer<typeof sortEntrySchema>;

const paginationEntrySchema = z.object({
  page: z.number(),
  limit: z.number(),
});

const fieldFilterSchema = z.union([
  z.object({
    id: z.string(),
    type: z.literal("field"),
    field: z.literal("status"),
    value: z.literal("todo"),
  }),
  z.object({
    id: z.string(),
    type: z.literal("field"),
    field: z.literal("status"),
    value: z.literal("done"),
  }),
]);
export type FieldFilter = z.infer<typeof fieldFilterSchema>;

const selectionFilterSchema = z
  .union([z.literal("selected"), z.literal("unselected")])
  .nullable();
export type SelectionFilter = z.infer<typeof selectionFilterSchema>;

const paginatedTasksInputSchema = z.object({
  sortEntry: sortEntrySchema,
  paginationEntry: paginationEntrySchema,
  fieldFilters: z.array(fieldFilterSchema),
  selectionFilter: selectionFilterSchema,
  searchText: z.string(),
  selectedTaskIds: z.array(z.string()),
});
export type PaginatedTasksInput = z.infer<typeof paginatedTasksInputSchema>;

const paginatedTasksEntrySchema = z.object({
  tasks: z.array(taskSchema),
  totalPages: z.number(),
});
type PaginatedTasksEntry = z.infer<typeof paginatedTasksEntrySchema>;

export const createTaskInputSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルの入力は必須です。")
    .max(100, "タスクは100文字以下で入力してください。"),
  description: z.string().max(10000, "説明は10000文字以下で入力してください。"),
});
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;

export const updateTaskInputSchema = z
  .object({
    title: z
      .string()
      .min(1, "タイトルの入力は必須です。")
      .max(100, "タスクは100文字以下で入力してください。"),
    description: z
      .string()
      .max(10000, "説明は10000文字以下で入力してください。"),
  })
  .extend(taskSchema.pick({ status: true }).shape);
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;

export const updateTaskStatusesInputSchema = z
  .object({
    selectedTaskIds: z.array(z.string()),
  })
  .extend(taskSchema.pick({ status: true }).shape);
export type UpdateTaskStatusesInput = z.infer<
  typeof updateTaskStatusesInputSchema
>;

export const Todo2API = {
  base: "/todo-2/api",
  getTasks: (input?: PaginatedTasksInput) =>
    `${Todo2API.base}/tasks${
      input ? `?input=${encodeURIComponent(JSON.stringify(input))}` : ""
    }`,
  task: (id?: string) => `${Todo2API.base}/tasks/${id ?? ":id"}`,
  createTask: () => `${Todo2API.base}/tasks`,
  updateTaskStatuses: () => `${Todo2API.base}/update-task-statuses`,
  deleteTasks: () => `${Todo2API.base}/delete-tasks`,
};

export const fetchPaginatedTasks = async (
  input: PaginatedTasksInput,
): Promise<PaginatedTasksEntry> => {
  const res = await fetcher.get(Todo2API.getTasks(input));
  const json = await res.json();
  const tasks = paginatedTasksEntrySchema.parse(json);

  return tasks;
};

export const fetchTask = async (id: string): Promise<Task | null> => {
  const res = await fetcher.get(Todo2API.task(id));
  const json = await res.json();
  const task = taskSchema.nullable().parse(json);

  return task;
};

export const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const res = await fetcher.post(Todo2API.createTask(), { body: input });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const updateTask = async (
  input: UpdateTaskInput & { id: string },
): Promise<Task> => {
  const res = await fetcher.put(Todo2API.task(input.id), { body: input });
  const json = await res.json();
  const task = taskSchema.parse(json);

  return task;
};

export const updateTaskStatuses = async (
  input: UpdateTaskStatusesInput,
): Promise<void> => {
  await fetcher.patch(Todo2API.updateTaskStatuses(), { body: input });

  return;
};

export const deleteTasks = async (ids: string[]): Promise<void> => {
  await fetcher.delete(Todo2API.deleteTasks(), { body: ids });
  return;
};

export const todo2Handlers = [
  http.get(Todo2API.getTasks(), async ({ request }) => {
    const searchParam = new URL(request.url).searchParams;
    const input = JSON.parse(searchParam.get("input") ?? "{}");

    const {
      sortEntry,
      paginationEntry,
      fieldFilters,
      selectionFilter,
      searchText,
      selectedTaskIds,
    } = paginatedTasksInputSchema.parse(input);

    const { field, order } = sortEntry;

    const allTasks = await todo2TaskRepository.getAll();

    const filteredTasks = allTasks.filter((task) => {
      if (fieldFilters.length === 0 && selectionFilter === null) {
        return true;
      }

      const statusFilters = fieldFilters.filter((f) => f.field === "status");
      const isMatchingStatusFilter =
        statusFilters.length > 0
          ? statusFilters.some((f) => task[f.field] === f.value)
          : true;

      const isMatchingSelectionFilter = (() => {
        switch (selectionFilter) {
          case "selected": {
            return selectedTaskIds.includes(task.id);
          }
          case "unselected": {
            return !selectedTaskIds.includes(task.id);
          }
          case null: {
            return true;
          }
          default: {
            throw new Error(selectionFilter satisfies never);
          }
        }
      })();

      return isMatchingStatusFilter && isMatchingSelectionFilter;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
      switch (field) {
        case "title": {
          return a.title.localeCompare(b.title) * (order === "desc" ? -1 : 1);
        }
        case "createdAt":
        case "completedAt": {
          return (
            ((a[field]?.getTime() ?? Number.MAX_VALUE) -
              (b[field]?.getTime() ?? Number.MAX_VALUE)) *
            (order === "desc" ? -1 : 1)
          );
        }
        default: {
          throw new Error(field satisfies never);
        }
      }
    });

    const searchedTasks = sortedTasks.filter((task) => {
      return (
        task.title.includes(searchText) || task.description.includes(searchText)
      );
    });

    const { page, limit } = paginationEntry;
    const paginatedTasks = paginate(searchedTasks, { page, limit });

    return HttpResponse.json({
      tasks: paginatedTasks,
      totalPages: Math.ceil(searchedTasks.length / limit),
    } satisfies PaginatedTasksEntry);
  }),

  http.get(Todo2API.task(), async ({ params }) => {
    const id = z.string().parse(params.id);
    const task = await todo2TaskRepository.get(id);
    return HttpResponse.json(task ?? null);
  }),

  http.post(Todo2API.createTask(), async ({ request }) => {
    const input = createTaskInputSchema.parse(await request.json());
    const createdTask = await todo2TaskRepository.add(input);

    return HttpResponse.json(createdTask);
  }),

  http.put(Todo2API.task(), async ({ params, request }) => {
    const id = z.string().parse(params.id);
    const input = updateTaskInputSchema.parse(await request.json());
    const updatedTask = await todo2TaskRepository.update({
      id: id,
      title: input.title,
      description: input.description,
      status: input.status,
    });

    return HttpResponse.json(updatedTask);
  }),

  http.patch(Todo2API.updateTaskStatuses(), async ({ request }) => {
    const input = updateTaskStatusesInputSchema.parse(await request.json());
    await todo2TaskRepository.updateTaskStatuses({
      selectedTaskIds: input.selectedTaskIds,
      status: input.status,
    });

    return HttpResponse.json({});
  }),

  http.delete(Todo2API.deleteTasks(), async ({ request }) => {
    const ids = z.array(z.string()).parse(await request.json());
    await todo2TaskRepository.remove(ids);

    return HttpResponse.json({});
  }),
];
