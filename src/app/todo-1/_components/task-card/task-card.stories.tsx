import { Meta, StoryObj } from "@storybook/nextjs";
import { TaskCard } from "./task-card";
import { defaultStoryMeta } from "../../story-meta";
import { initialTasks } from "../../_backend/data";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { HttpResponse, http } from "msw";
import { Todo1API, updateTaskInputSchema } from "../../_backend/api";

const updateTaskMock = fn();
const deleteTaskMock = fn();
const dummyTask = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskCard",
  component: TaskCard,
} satisfies Meta<typeof TaskCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.put(Todo1API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          updateTaskMock({ id: params.id as string, ...input });

          return HttpResponse.json(dummyTask);
        }),
        http.delete(Todo1API.task(), async ({ params }) => {
          deleteTaskMock(params.id);

          return HttpResponse.json({});
        }),
      ],
    },
  },
  args: { task: dummyTask },
  play: async ({ canvasElement, step, args }) => {
    const task = args.task;
    const canvas = within(canvasElement.parentElement!);

    await step("タイトルが正しく表示されている", async () => {
      await expect(canvas.getByLabelText(task.title)).toBeInTheDocument();
    });

    await step("完了状態の更新APIが呼ばれる", async () => {
      const doneChangeCheckbox = canvas.getByRole("checkbox", {
        name: "完了状態を変更",
      });
      await userEvent.click(doneChangeCheckbox);

      await waitFor(async () => {
        await expect(updateTaskMock).toHaveBeenCalledTimes(1);
        await expect(updateTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({
            id: task.id,
            done: !task.done,
          }),
        );
      });

      clearAllMocks();
    });

    await step("タイトル更新APIが呼ばれる", async () => {
      const editTrigger = canvas.getByRole("button", {
        name: "タイトルを編集",
      });
      await userEvent.click(editTrigger);

      const titleInput = canvas.getByRole("textbox", { name: "タイトル" });
      const updatedTitle = "update";

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, `${updatedTitle}{enter}`);

      await waitFor(async () => {
        await expect(updateTaskMock).toHaveBeenCalledTimes(1);
        await expect(updateTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({ id: task.id, title: updatedTitle }),
        );
      });

      clearAllMocks();
    });

    await step("削除APIが呼ばれる", async () => {
      const deleteTrigger = canvas.getByRole("button", {
        name: "削除ダイアログを開く",
      });
      await userEvent.click(deleteTrigger);

      const deleteButton = canvas.getByRole("button", { name: "削除する" });
      await userEvent.click(deleteButton);

      await waitFor(async () => {
        await expect(deleteTaskMock).toHaveBeenCalledTimes(1);
        await expect(deleteTaskMock).toHaveBeenCalledWith(task.id);
      });

      const closeButton = canvas.getByRole("button", { name: "閉じる" });
      await userEvent.click(closeButton);
    });
  },
};

export const Done: Story = {
  args: { task: { ...dummyTask, done: true } },
};
