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
import preview from "../../../../.storybook/preview";

const createTaskMock = fn();
const handleOpenChangeMock = fn();
const dummyTask = initialTasks[0];

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo2/TaskAddDialog",
  component: TaskAddDialog,
  afterEach: () => {
    clearAllMocks();
  },
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
});

export default meta;

export const Default = meta.story({});

Default.test(
  "デフォルトでは、作成したあとにダイアログが閉じる",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const title = "タスク";

    const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
    await userEvent.type(titleInput, `${title}{enter}`, { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).toHaveBeenCalledTimes(1);
      await expect(createTaskMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title,
          description: "",
        } satisfies CreateTaskInput)
      );
      await expect(handleOpenChangeMock).toHaveBeenCalledTimes(1);
      await expect(handleOpenChangeMock).toHaveBeenCalledWith(false);
    });
  }
);

Default.test(
  "トグルを切り替えると、作成したあとにダイアログが閉じない",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const title = "タスク";

    const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");
    const checkbox = await canvas.findByLabelText("続けて作成する");

    await userEvent.click(checkbox);
    await userEvent.type(titleInput, `${title}{enter}`, { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).toHaveBeenCalledTimes(1);
      await expect(createTaskMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title,
          description: "",
        } satisfies CreateTaskInput)
      );
      await expect(handleOpenChangeMock).not.toHaveBeenCalled();
    });
  }
);

Default.test(
  "タイトル未入力時にエラーが表示される",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = await canvas.findByPlaceholderText("タスクのタイトル");

    await userEvent.type(titleInput, "{enter}", { delay: 50 });

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(handleOpenChangeMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タイトルの入力は必須です。"
      );
    });
  }
);
