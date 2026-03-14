import { z } from "zod";
import { TaskStatus } from "../task-status/store";
import { initialStatuses } from "../task-status/data";
import { Task } from "../task/store";
import { initialTasks } from "../task/data";

export const viewColumnRecordSchema = z.object({
  statusId: z.string(),
  order: z.coerce.number(),
});

export const viewTaskRecordSchema = z.object({
  taskId: z.string(),
  order: z.coerce.number(),
});

export const viewRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  columnRecords: z.array(viewColumnRecordSchema),
  taskRecords: z.array(viewTaskRecordSchema),
});

type ViewColumnRecord = z.infer<typeof viewColumnRecordSchema>;
type ViewTaskRecord = z.infer<typeof viewTaskRecordSchema>;
type ViewRecord = z.infer<typeof viewRecordSchema>;

class ViewRecordStore {
  private viewRecords = [...new Array(3)].map((_, i): ViewRecord => {
    const columnRecords = initialStatuses.map((status, i): ViewColumnRecord => {
      return { statusId: status.id, order: i + 1 };
    });

    const taskRecords = initialTasks.map((task, i): ViewTaskRecord => {
      return { taskId: task.id, order: i + 1 };
    });

    return {
      id: `${i + 1}`,
      name: `View${i + 1}`,
      columnRecords,
      taskRecords,
    };
  });

  public getAll(): ViewRecord[] {
    return this.viewRecords;
  }

  public get(id: string): ViewRecord | undefined {
    return this.viewRecords.find((vc) => vc.id === id);
  }

  public add(input: { name: string; allTasks: Task[]; allStatus: TaskStatus[] }) {
    const newView: ViewRecord = {
      id: crypto.randomUUID(),
      name: input.name,
      columnRecords: input.allStatus.map((s, i): ViewColumnRecord => {
        return { statusId: s.id, order: i + 1 };
      }),
      taskRecords: input.allTasks.map((t, i): ViewTaskRecord => {
        return { taskId: t.id, order: i + 1 };
      }),
    };

    this.viewRecords = [...this.viewRecords, newView];
  }

  public update(input: { id: string; name: string }) {
    this.viewRecords = this.viewRecords.map((view): ViewRecord => {
      if (view.id !== input.id) {
        return view;
      }

      return { ...view, name: input.name };
    });
  }

  public remove(viewId: string) {
    this.viewRecords = this.viewRecords.filter((record) => record.id !== viewId);
  }

  public moveTask(input: { viewId: string; taskId: string; newOrder: number }) {
    this.viewRecords = this.viewRecords.map((viewRecord) => {
      if (viewRecord.id === input.viewId) {
        return {
          ...viewRecord,
          taskRecords: viewRecord.taskRecords.map((taskRecord) => {
            if (taskRecord.taskId === input.taskId) {
              return { ...taskRecord, order: input.newOrder };
            }
            return taskRecord;
          }),
        };
      }
      return viewRecord;
    });
  }

  public moveTaskToEndOfStatus(input: {
    viewIds: string[];
    taskId: string;
    targetStatusTaskIds: string[];
  }) {
    this.viewRecords = this.viewRecords.map((viewRecord) => {
      if (!input.viewIds.includes(viewRecord.id)) {
        return viewRecord;
      }

      const targetStatusTaskOrders = viewRecord.taskRecords
        .filter((task) => input.targetStatusTaskIds.includes(task.taskId))
        .map((t) => t.order);
      const maxOrderInStatus = Math.max(...targetStatusTaskOrders);

      return {
        ...viewRecord,
        taskRecords: viewRecord.taskRecords.map((task) => {
          if (task.taskId === input.taskId) {
            return { ...task, order: maxOrderInStatus + 1 };
          }
          return task;
        }),
      };
    });
  }

  public moveColumn(input: { viewId: string; statusId: string; newOrder: number }) {
    this.viewRecords = this.viewRecords.map((viewRecord) => {
      if (viewRecord.id !== input.viewId) {
        return viewRecord;
      }

      return {
        ...viewRecord,
        columnRecords: viewRecord.columnRecords.map((columnRecord) => {
          if (columnRecord.statusId === input.statusId) {
            return { ...columnRecord, order: input.newOrder };
          }
          return columnRecord;
        }),
      };
    });
  }

  public addColumnToAllRecords(statusId: string) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      const newOrder =
        config.columnRecords.length === 0
          ? 1
          : Math.max(...config.columnRecords.map((c) => c.order)) + 1;

      return {
        ...config,
        columnRecords: [...config.columnRecords, { statusId, order: newOrder }],
      };
    });
  }

  public addTaskToAllRecords(input: {
    taskId: string;
    statusId: string;
    sameStatusTaskIds: string[];
  }) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      const tasks = config.taskRecords.filter((t) => input.sameStatusTaskIds.includes(t.taskId));
      const newOrder = tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.order)) + 1;

      return {
        ...config,
        taskRecords: [...config.taskRecords, { taskId: input.taskId, order: newOrder }],
      };
    });
  }

  public removeTaskFromAllRecords(taskId: string) {
    this.viewRecords = this.viewRecords.map((config): ViewRecord => {
      return {
        ...config,
        taskRecords: config.taskRecords.filter((t) => t.taskId !== taskId),
      };
    });
  }
}

export const viewRecordStore = new ViewRecordStore();
