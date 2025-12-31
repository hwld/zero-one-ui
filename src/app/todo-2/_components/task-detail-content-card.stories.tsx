import { TaskDetailContentCard } from "./task-detail-content-card";
import { defaultStoryMeta } from "../story-meta";
import { initialTasks } from "../_backend/data";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { HttpResponse, http } from "msw";
import {
  Todo2API,
  UpdateTaskInput,
  updateTaskInputSchema,
} from "../_backend/api";
import preview from "../../../../.storybook/preview";

const dummyTask = initialTasks[0];

const mockUpdateTask = fn();

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo2/TaskDetailContentCard",
  component: TaskDetailContentCard,
  afterEach: () => {
    clearAllMocks();
  },
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      return (
        <div className="h-[500px]">
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: [
        http.put(Todo2API.task(), async ({ request, params }) => {
          const input = updateTaskInputSchema.parse(await request.json());
          mockUpdateTask({ ...input, id: params.id });

          return HttpResponse.json(dummyTask);
        }),
      ],
    },
  },
});

export default meta;

export const Default = meta.story({
  args: { task: dummyTask },
});

Default.test("タスクを編集できる", async ({ canvasElement, args }) => {
  const task = args.task;
  const canvas = within(canvasElement.parentElement!);

  await userEvent.click(
    await canvas.findByRole("button", { name: "編集する" })
  );

  const newTitle = "title";
  const newDesc = "desc\ndesc";

  const titleInput = await canvas.findByDisplayValue(task.title);
  const descInput = await canvas.findByDisplayValue(task.description, {
    collapseWhitespace: false,
  });

  await userEvent.clear(titleInput);
  await userEvent.clear(descInput);

  await userEvent.type(titleInput, newTitle, { delay: 50 });
  await userEvent.type(descInput, newDesc, { delay: 50 });

  await userEvent.click(
    await canvas.findByRole("button", { name: "保存する" })
  );

  await waitFor(async () => {
    await expect(mockUpdateTask).toHaveBeenCalledTimes(1);
    await expect(mockUpdateTask).toHaveBeenCalledWith({
      id: task.id,
      status: task.status,
      title: newTitle,
      description: newDesc,
    } satisfies { id: string } & UpdateTaskInput);
  });
});

Default.test(
  "タイトルが空の場合はエラーが表示されて、保存されない",
  async ({ canvasElement, args }) => {
    const task = args.task;
    const canvas = within(canvasElement.parentElement!);

    await userEvent.click(
      await canvas.findByRole("button", { name: "編集する" })
    );

    const titleInput = await canvas.findByDisplayValue(task.title);
    await userEvent.clear(titleInput);

    await userEvent.click(
      await canvas.findByRole("button", { name: "保存する" })
    );

    await waitFor(async () => {
      await expect(mockUpdateTask).not.toBeCalled();
      await expect(titleInput).toHaveAccessibleErrorMessage(
        "タイトルの入力は必須です。"
      );
    });
  }
);
