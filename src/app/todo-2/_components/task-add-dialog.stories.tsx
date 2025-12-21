import { Meta, StoryObj } from "@storybook/nextjs";
import { defaultStoryMeta } from "../story-meta";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { TaskAddDialog } from "./task-add-dialog";
import { HttpResponse, http } from "msw";
import {
  CreateTaskInput,
  Todo2API,
  createTaskInputSchema,
} from "../_backend/api";
import { initialTasks } from "../_backend/data";

const createTaskMock = fn();
const handleOpenChangeMock = fn();
const dummyTask = initialTasks[0];

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/TaskAddDialog",
  component: TaskAddDialog,
  parameters: {
    msw: {
      handlers: [
        http.post(Todo2API.createTask(), async ({ request }) => {
          const input = createTaskInputSchema.parse(await request.json());
          createTaskMock(input);

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
  args: { isOpen: true, onOpenChange: handleOpenChangeMock },
} satisfies Meta<typeof TaskAddDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentElement!);
    const title = "タスク";

    await step("デフォルトでは、作成したあとにダイアログが閉じる", async () => {
      const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
      await userEvent.type(titleInput, `${title}{enter}`, { delay: 50 });

      await waitFor(async () => {
        await expect(createTaskMock).toHaveBeenCalledTimes(1);
        await expect(createTaskMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title,
            description: "",
          } satisfies CreateTaskInput),
        );
        await expect(handleOpenChangeMock).toHaveBeenCalledTimes(1);
        await expect(handleOpenChangeMock).toHaveBeenCalledWith(false);
      });

      clearAllMocks();
    });

    await step(
      "トグルを切り替えると、作成したあとにダイアログが閉じない",
      async () => {
        const titleInput =
          await canvas.findByPlaceholderText("タスクのタイトル");
        const checkbox = await canvas.findByLabelText("続けて作成する");

        await userEvent.click(checkbox);
        await userEvent.type(titleInput, `${title}{enter}`, { delay: 50 });

        await waitFor(async () => {
          await expect(createTaskMock).toHaveBeenCalledTimes(1);
          await expect(createTaskMock).toHaveBeenCalledWith(
            expect.objectContaining({
              title,
              description: "",
            } satisfies CreateTaskInput),
          );
          await expect(handleOpenChangeMock).not.toHaveBeenCalled();
        });

        clearAllMocks();
      },
    );
  },
};

export const NoTitleError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");

    await userEvent.type(titleInput, "{enter}", { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(handleOpenChangeMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タイトルの入力は必須です。",
      );
    });
  },
};
