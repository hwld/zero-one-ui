import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskCreateInput } from "./task-create-input";
import { defaultStoryMeta } from "../story-meta";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Todo1API, createTaskInputSchema } from "../_backend/api";
import { HttpResponse, http } from "msw";
import { initialTasks } from "../_backend/data";

const createTaskMock = fn();
const dummyTask = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  parameters: {
    msw: {
      handlers: [
        http.post(Todo1API.tasks(), async ({ request }) => {
          const input = createTaskInputSchema.parse(await request.json());
          createTaskMock(input.title);

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
  title: "Todo1/TaskCreateInput",
  component: TaskCreateInput,
} satisfies Meta<typeof TaskCreateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // canvasElementを直接使うと、portalが見えない
    // https://github.com/storybookjs/storybook/issues/16971
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");
    const title = "たすく";

    await userEvent.type(titleInput, `${title}{enter}`, { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).toHaveBeenCalledTimes(1);
      await expect(createTaskMock).toHaveBeenCalledWith(title);
      await expect(titleInput).toHaveValue("");
    });
  },
};

export const NoTitleError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.type(titleInput, "{enter}");

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タスクのタイトルを入力してください",
      );
    });
  },
};

export const MaxLengthError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.click(titleInput);
    await userEvent.paste(`${"a".repeat(200)}`);
    await userEvent.type(titleInput, "{enter}");

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タスクのタイトルは100文字以内で入力してください",
      );
    });
  },
};
