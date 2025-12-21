import { Meta, StoryObj } from "@storybook/nextjs";
import { defaultStoryMeta } from "../story-meta";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { TaskAddButton } from "./task-add-button";
import { Todo2API } from "../_backend/api";
import { HttpResponse, http } from "msw";
import { initialTasks } from "../_backend/data";

const createTaskMock = fn();
const dummyTask = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/TaskAddButton",
  component: TaskAddButton,
} satisfies Meta<typeof TaskAddButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
  play: async ({ canvasElement, step }) => {
    await step("タイトルのみのタスクをキーボードだけで作成できる", async () => {
      const canvas = within(canvasElement.parentElement!);

      await userEvent.keyboard("{meta>}k");

      const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
      await userEvent.type(titleInput, "title{enter}", { delay: 50 });

      await waitFor(async () => {
        await expect(createTaskMock).toHaveBeenCalledTimes(1);
      });
    });
  },
};
