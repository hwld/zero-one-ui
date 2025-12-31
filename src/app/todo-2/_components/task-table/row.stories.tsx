import { TaskTableRow } from "./row";
import { defaultStoryMeta } from "../../story-meta";
import { initialTasks } from "../../_backend/data";
import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { TaskTableSelectionContext } from "./selection-provider";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { useState } from "react";
import { getTaskStatusLabel } from "../../_backend/task-store";
import { HttpResponse, http } from "msw";
import {
  Todo2API,
  UpdateTaskInput,
  updateTaskInputSchema,
} from "../../_backend/api";
import { z } from "zod";
import { getRouter } from "@storybook/nextjs-vite/router.mock";
import { Routes } from "../../_lib/routes";
import { MockTaskTableProvider } from "./provider";
import preview from "../../../../../.storybook/preview";

const dummyTask = initialTasks[0];

const mockToggleSelection = fn();
const mockUpdateTask = fn();
const mockDeleteTask = fn();

const meta = preview.meta({
  ...defaultStoryMeta,
  component: TaskTableRow,
  title: "Todo2/TaskTableRow",
  parameters: {
    msw: {
      handlers: [
        http.put(Todo2API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          mockUpdateTask({ id: params.id, ...input });

          return HttpResponse.json(dummyTask);
        }),

        http.delete(Todo2API.deleteTasks(), async ({ request }) => {
          const input = z.array(z.string()).parse(await request.json());
          mockDeleteTask(input);

          return HttpResponse.json({});
        }),
      ],
    },
  },
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);

      const selectionContext: TaskTableSelectionContext = {
        selectedTaskIds: selectedIds,
        selectTaskIds: () => {},
        toggleTaskSelection: (id) => {
          mockToggleSelection(id);
          setSelectedIds((ids) =>
            ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
          );
        },
        unselectAllTasks: () => {},
        unselectTaskIds: () => {},
      };

      return (
        <ScrollableRootProvider>
          <MockTaskTableProvider mockSelection={selectionContext}>
            <table>
              <tbody>
                <Story />
              </tbody>
            </table>
          </MockTaskTableProvider>
        </ScrollableRootProvider>
      );
    },
  ],
});
export default meta;

export const Default = meta.story({
  args: { task: dummyTask },
});

Default.test(
  "選択状態を切り替えることができる",
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.parentElement!);
    const toggleSelection = await canvas.findByRole("checkbox", {
      name: "選択状態を切り替える",
    });

    await userEvent.click(toggleSelection);
    await userEvent.click(toggleSelection);

    await waitFor(async () => {
      await expect(mockToggleSelection).toHaveBeenCalledTimes(2);
      await expect(mockToggleSelection).toHaveBeenNthCalledWith(
        1,
        args.task.id
      );
      await expect(mockToggleSelection).toHaveBeenNthCalledWith(
        2,
        args.task.id
      );
    });

    clearAllMocks();
  }
);

Default.test(
  "完了状態を切り替えるAPIが呼ばれる",
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.parentElement!);
    const toggleStatus = await canvas.findByRole("button", {
      name: getTaskStatusLabel(args.task.status),
    });

    await userEvent.click(toggleStatus);

    await waitFor(async () => {
      await expect(mockUpdateTask).toHaveBeenCalledTimes(1);
      await expect(mockUpdateTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: args.task.id,
          ...updateTaskInputSchema.parse(args.task),
          status: args.task.status === "done" ? "todo" : "done",
        } satisfies UpdateTaskInput & { id: string })
      );
    });
  }
);

Default.test(
  "タスクの詳細ページに遷移できる",
  async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.parentElement!);
    const link = await canvas.findByRole("link", { name: args.task.title });

    await userEvent.click(link);

    await waitFor(async () => {
      await expect(getRouter().push).toHaveBeenCalledTimes(1);
      await expect(getRouter().push).toHaveBeenCalledWith(
        Routes.detail(args.task.id),
        expect.anything(),
        expect.anything()
      );
    });
  }
);

Default.test("タスクの削除APIが呼ばれる", async ({ canvasElement, args }) => {
  const canvas = within(canvasElement.parentElement!);
  const openButton = await canvas.findByRole("button", {
    name: "削除ダイアログを開く",
  });

  await userEvent.click(openButton);

  const deleteButton = await canvas.findByRole("button", { name: "削除する" });
  const closeButton = await canvas.findByRole("button", {
    name: "キャンセルする",
  });

  await userEvent.click(deleteButton);
  await userEvent.click(closeButton);

  await waitFor(async () => {
    await expect(mockDeleteTask).toHaveBeenCalledTimes(1);
    await expect(mockDeleteTask).toHaveBeenCalledWith([args.task.id]);
  });
});
