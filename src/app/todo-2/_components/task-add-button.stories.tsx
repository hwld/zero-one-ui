import { defaultStoryMeta } from "../story-meta";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { TaskAddButton } from "./task-add-button";
import { Todo2API } from "../_backend/api";
import { HttpResponse, http } from "msw";
import { initialTasks } from "../_backend/data";
import preview from "../../../../.storybook/preview";

const createTaskMock = fn();
const dummyTask = initialTasks[0];

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo2/TaskAddButton",
  component: TaskAddButton,
});

export default meta;

export const Default = meta.story({
  parameters: {
    msw: {
      handlers: [
        http.post(Todo2API.createTask(), () => {
          createTaskMock();

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
});

Default.test(
  "タイトルのみのタスクをキーボードだけで作成できる",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);

    await userEvent.keyboard("{meta>}k");

    const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
    await userEvent.type(titleInput, "title{enter}", { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).toHaveBeenCalledTimes(1);
    });
  },
);
