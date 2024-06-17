import { Meta, StoryObj } from "@storybook/react";
import { TaskDetailSheet } from "./task-detail-sheet";
import { defaultStoryMeta } from "../../story-meta";
import { initialTasks } from "../../_mocks/data";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "@storybook/test";
import { HttpResponse, http } from "msw";
import { Todo1API, updateTaskInputSchema } from "../../_mocks/api";
import { waitForAnimation } from "@/app/_test/utils";

const updateTaskMock = fn();
const handleOpenChangeMock = fn();
const dummyTask = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskDetailSheet",
  component: TaskDetailSheet,
} satisfies Meta<typeof TaskDetailSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put(Todo1API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          updateTaskMock({ id: params.id, ...input });

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
  args: { isOpen: true, onOpenChange: handleOpenChangeMock, task: dummyTask },
  play: async ({ canvasElement, step, args }) => {
    const task = args.task;
    const statusText = task.done ? "完了" : "未完了";
    const canvas = within(canvasElement.parentElement!);

    await waitForAnimation();

    await step("タスクの情報が表示される", async () => {
      await expect(await canvas.findByText(task.title)).toBeInTheDocument();
      await expect(await canvas.findByText(statusText)).toBeInTheDocument();
      await expect(
        await canvas.findByDisplayValue(task.description, {
          collapseWhitespace: false,
        }),
      ).toBeInTheDocument();
    });

    await step("タスクの状態を更新できる", async () => {
      const statusChangeButton = await canvas.findByRole("button", {
        name: statusText,
      });

      await userEvent.click(statusChangeButton);

      await waitFor(async () => {
        await expect(updateTaskMock).toHaveBeenCalledTimes(1);
        await expect(updateTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({ id: task.id, done: !task.done }),
        );
      });

      clearAllMocks();
    });

    await step("タスクの説明を変更できる", async () => {
      const descTextarea = await canvas.findByRole("textbox", { name: "説明" });
      const newDesc = "説明\nです";

      await userEvent.clear(descTextarea);
      await userEvent.type(descTextarea, newDesc, { delay: 50 });

      const submitButton = await canvas.findByRole("button", { name: "保存" });
      await userEvent.click(submitButton);

      await waitFor(async () => {
        await expect(updateTaskMock).toHaveBeenCalledTimes(1);
        await expect(updateTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({ id: task.id, description: newDesc }),
        );
      });

      // submitのためのcontrolを非表示にする
      const cancelButton = await canvas.findByRole("button", {
        name: "変更を取り消す",
      });
      await userEvent.click(cancelButton);

      clearAllMocks();
    });

    await step("シートを閉じることができる", async () => {
      const closeButton = await canvas.findByRole("button", {
        name: "シートを閉じる",
      });

      await userEvent.click(closeButton);

      await waitFor(async () => {
        await expect(handleOpenChangeMock).toHaveBeenCalledTimes(1);
        await expect(handleOpenChangeMock).toHaveBeenCalledWith(false);
      });
    });
  },
};