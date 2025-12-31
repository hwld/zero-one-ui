import { TaskDetailSheet } from "./task-detail-sheet";
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
import { waitForAnimation } from "../../../_test/utils";
import preview from "../../../../../.storybook/preview";

const updateTaskMock = fn();
const handleOpenChangeMock = fn();
const dummyTask = initialTasks[0];

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo1/TaskDetailSheet",
  component: TaskDetailSheet,
});

export default meta;

export const Default = meta.story({
  parameters: {
    msw: {
      handlers: [
        http.get(Todo1API.task(), () => {
          return HttpResponse.json(dummyTask);
        }),

        http.put(Todo1API.task(), async ({ params, request }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          updateTaskMock({ id: params.id, ...input });

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
  args: {
    isOpen: true,
    onOpenChange: handleOpenChangeMock,
    taskId: dummyTask.id,
  },
});

Default.test("タスクの情報が表示される", async ({ canvasElement }) => {
  const statusText = dummyTask.done ? "完了" : "未完了";
  const canvas = within(canvasElement.parentElement!);

  await waitForAnimation();

  await expect(await canvas.findByText(dummyTask.title)).toBeInTheDocument();
  await expect(await canvas.findByText(statusText)).toBeInTheDocument();
  await expect(
    await canvas.findByDisplayValue(dummyTask.description, {
      collapseWhitespace: false,
    })
  ).toBeInTheDocument();
});

Default.test("タスクの状態を更新できる", async ({ canvasElement }) => {
  const statusText = dummyTask.done ? "完了" : "未完了";
  const canvas = within(canvasElement.parentElement!);

  await waitForAnimation();

  const statusChangeButton = await canvas.findByRole("button", {
    name: statusText,
  });

  await userEvent.click(statusChangeButton);

  await waitFor(async () => {
    await expect(updateTaskMock).toHaveBeenCalledTimes(1);
    await expect(updateTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: dummyTask.id, done: !dummyTask.done })
    );
  });

  clearAllMocks();
});

Default.test("タスクの説明を変更できる", async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement!);

  await waitForAnimation();

  const descTextarea = await canvas.findByRole("textbox", { name: "説明" });
  const newDesc = "説明\nです";

  await userEvent.clear(descTextarea);
  await userEvent.type(descTextarea, newDesc, { delay: 50 });

  const submitButton = await canvas.findByRole("button", { name: "保存" });
  await userEvent.click(submitButton);

  await waitFor(async () => {
    await expect(updateTaskMock).toHaveBeenCalledTimes(1);
    await expect(updateTaskMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: dummyTask.id, description: newDesc })
    );
  });

  // submitのためのcontrolを非表示にする
  const cancelButton = await canvas.findByRole("button", {
    name: "変更を取り消す",
  });
  await userEvent.click(cancelButton);

  clearAllMocks();
});

Default.test("シートを閉じることができる", async ({ canvasElement }) => {
  const canvas = within(canvasElement.parentElement!);

  await waitForAnimation();

  const closeButton = await canvas.findByRole("button", {
    name: "シートを閉じる",
  });

  await userEvent.click(closeButton);

  await waitFor(async () => {
    await expect(handleOpenChangeMock).toHaveBeenCalledTimes(1);
    await expect(handleOpenChangeMock).toHaveBeenCalledWith(false);
  });
});
