import { z } from "zod";
import { taskStatusStore } from "../task-status/store";
import { initialStatuses } from "../task-status/data";
import { taskStore } from "../task/store";
import { initialTasks } from "../task/data";

export const viewColumnConfigSchema = z.object({
  statusId: z.string(),
  order: z.coerce.number(),
});

export const viewTaskConfigSchema = z.object({
  taskId: z.string(),
  order: z.coerce.number(),
});

export const viewConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  columnConfigs: z.array(viewColumnConfigSchema),
  taskConfigs: z.array(viewTaskConfigSchema),
});

export type ViewColumnConfig = z.infer<typeof viewColumnConfigSchema>;
export type ViewTaskConfig = z.infer<typeof viewTaskConfigSchema>;
export type ViewConfig = z.infer<typeof viewConfigSchema>;

class ViewConfigStore {
  private viewConfigs: ViewConfig[] = [...new Array(3)].map((_, i) => {
    const columnConfigs = initialStatuses.map((status, i): ViewColumnConfig => {
      return { statusId: status.id, order: i + 1 };
    });
    const taskConfigs = initialTasks.map((task, i): ViewTaskConfig => {
      return { taskId: task.id, order: i + 1 };
    });

    return {
      id: `${i + 1}`,
      name: `View${i + 1}`,
      columnConfigs,
      taskConfigs,
    };
  });

  public getAll(): ViewConfig[] {
    return this.viewConfigs;
  }

  public get(id: string): ViewConfig | undefined {
    return this.viewConfigs.find((vc) => vc.id === id);
  }

  public add(name: string) {
    const allStatus = taskStatusStore.getAll();
    const allTasks = taskStore.getAll();

    const newView: ViewConfig = {
      id: crypto.randomUUID(),
      name,
      columnConfigs: allStatus.map((s, i): ViewColumnConfig => {
        return { statusId: s.id, order: i + 1 };
      }),
      taskConfigs: allTasks.map((t, i): ViewTaskConfig => {
        return { taskId: t.id, order: i + 1 };
      }),
    };

    this.viewConfigs = [...this.viewConfigs, newView];
  }

  public moveTask(input: { viewId: string; taskId: string; newOrder: number }) {
    this.viewConfigs = this.viewConfigs.map((viewConfig) => {
      if (viewConfig.id === input.viewId) {
        return {
          ...viewConfig,
          taskConfigs: viewConfig.taskConfigs.map((taskConfig) => {
            if (taskConfig.taskId === input.taskId) {
              return { ...taskConfig, order: input.newOrder };
            }
            return taskConfig;
          }),
        };
      }
      return viewConfig;
    });
  }

  public moveColumn(input: {
    viewId: string;
    statusId: string;
    newOrder: number;
  }) {
    this.viewConfigs = this.viewConfigs.map((viewConfig) => {
      if (viewConfig.id !== input.viewId) {
        return viewConfig;
      }

      return {
        ...viewConfig,
        columnConfigs: viewConfig.columnConfigs.map((columnConfig) => {
          if (columnConfig.statusId === input.statusId) {
            return { ...columnConfig, order: input.newOrder };
          }
          return columnConfig;
        }),
      };
    });
  }

  public addColumnToAllConfigs(statusId: string) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      const newOrder =
        config.columnConfigs.length === 0
          ? 1
          : Math.max(...config.columnConfigs.map((c) => c.order)) + 1;
      return {
        ...config,
        columnConfigs: [...config.columnConfigs, { statusId, order: newOrder }],
      };
    });
  }

  public addTaskToAllConfigs(input: { taskId: string; statusId: string }) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      const taskIdsWithSameStatus = taskStore
        .getByStatusId(input.statusId)
        .map((t) => t.id);

      const tasks = config.taskConfigs.filter((t) =>
        taskIdsWithSameStatus.includes(t.taskId),
      );
      const newOrder =
        tasks.length === 0 ? 1 : Math.max(...tasks.map((t) => t.order)) + 1;

      return {
        ...config,
        taskConfigs: [
          ...config.taskConfigs,
          { taskId: input.taskId, order: newOrder },
        ],
      };
    });
  }

  public removeTaskFromAllConfigs(taskId: string) {
    this.viewConfigs = this.viewConfigs.map((config): ViewConfig => {
      return {
        ...config,
        taskConfigs: config.taskConfigs.filter((t) => t.taskId !== taskId),
      };
    });
  }
}

export const viewConfigStore = new ViewConfigStore();
