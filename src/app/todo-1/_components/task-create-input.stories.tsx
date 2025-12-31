import { TaskCreateInput } from "./task-create-input";
import { defaultStoryMeta } from "../story-meta";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Todo1API, createTaskInputSchema } from "../_backend/api";
import { HttpResponse, http } from "msw";
import { initialTasks } from "../_backend/data";
import preview from "../../../../.storybook/preview";

const createTaskMock = fn();
const dummyTask = initialTasks[0];

const meta = preview.meta({
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
});

export default meta;

export const Default = meta.story({});

Default.test("タイトル入力でタスクを作成できる", async ({ canvasElement }) => {
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
});

Default.test(
  "タイトル未入力時にエラーを表示する",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.type(titleInput, "{enter}");

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タスクのタイトルを入力してください"
      );
    });
  }
);

Default.test(
  "タイトルが長すぎるとエラーを表示する",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const titleInput = canvas.getByRole("textbox");

    await userEvent.click(titleInput);
    await userEvent.paste(`${"a".repeat(200)}`);
    await userEvent.type(titleInput, "{enter}");

    await waitFor(async () => {
      await expect(createTaskMock).not.toHaveBeenCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タスクのタイトルは100文字以内で入力してください"
      );
    });
  }
);
