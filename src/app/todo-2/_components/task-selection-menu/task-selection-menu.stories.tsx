import { TaskSelectionMenu } from "./task-selection-menu";
import { defaultStoryMeta } from "../../story-meta";
import { TaskTableSelectionContext } from "../task-table/selection-provider";
import {
  clearAllMocks,
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { HttpResponse, http } from "msw";
import {
  Todo2API,
  UpdateTaskStatusesInput,
  updateTaskStatusesInputSchema,
} from "../../_backend/api";
import { z } from "zod";
import { MockTaskTableProvider } from "../task-table/provider";
import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { waitForAnimation } from "../../../_test/utils";
import preview from "../../../../../.storybook/preview";

const mockUnselectAll = fn();
const mockDeleteTasks = fn();
const mockUpdateTaskStatuses = fn();

const mockContext: TaskTableSelectionContext = {
  selectedTaskIds: ["1", "2", "3"],
  selectTaskIds: () => {},
  toggleTaskSelection: () => {},
  unselectAllTasks: mockUnselectAll,
  unselectTaskIds: () => {},
};

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo2/TaskSelectionMenu",
  component: TaskSelectionMenu,
  afterEach: () => {
    clearAllMocks();
  },
  parameters: {
    msw: {
      handlers: [
        http.delete(Todo2API.deleteTasks(), async ({ request }) => {
          const ids = z.array(z.string()).parse(await request.json());
          mockDeleteTasks(ids);

          return HttpResponse.json({});
        }),

        http.patch(Todo2API.updateTaskStatuses(), async ({ request }) => {
          const input = updateTaskStatusesInputSchema.parse(
            await request.json(),
          );
          mockUpdateTaskStatuses(input);

          return HttpResponse.json({});
        }),
      ],
    },
  },
});

export default meta;

export const Default = meta.story({
  decorators: [
    (Story) => {
      return (
        <ScrollableRootProvider>
          <MockTaskTableProvider mockSelection={mockContext}>
            <Story />
          </MockTaskTableProvider>
        </ScrollableRootProvider>
      );
    },
  ],
});

export const NoSelect = meta.story({
  decorators: [
    (Story) => {
      return (
        <ScrollableRootProvider>
          <MockTaskTableProvider
            mockSelection={{ ...mockContext, selectedTaskIds: [] }}
          >
            <Story />
          </MockTaskTableProvider>
        </ScrollableRootProvider>
      );
    },
  ],
});

Default.test(
  "タスクが選択されているときはメニューが表示される",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);

    const menu = canvas.queryByRole("toolbar");
    await expect(menu).toBeInTheDocument();
  },
);

Default.test(
  "選択したすべてのタスクを選択解除できる",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const clearButton = await canvas.findByRole("button", {
      name: "選択解除",
    });

    await userEvent.click(clearButton);

    await waitFor(async () => {
      await expect(mockUnselectAll).toHaveBeenCalledTimes(1);
    });
  },
);

Default.test(
  "選択すたすべてのタスクを削除できる",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const openDeleteDialogButton = await canvas.findByRole("button", {
      name: "削除する",
    });

    await userEvent.click(openDeleteDialogButton);

    const deleteButton = await canvas.findByRole("button", {
      name: "削除する",
    });

    await userEvent.click(deleteButton);

    await waitFor(async () => {
      await expect(mockDeleteTasks).toHaveBeenCalledTimes(1);
      await expect(mockDeleteTasks).toHaveBeenCalledWith(
        mockContext.selectedTaskIds,
      );
    });

    // Tooltipを閉じる
    await fireEvent(openDeleteDialogButton, new MouseEvent("mouseleave"));
  },
);

Default.test(
  "選択したすべてのタスクを完了状態にできる",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const doneButton = await canvas.findByRole("button", {
      name: "完了状態にする",
    });

    await userEvent.click(doneButton);

    await waitFor(async () => {
      await expect(mockUpdateTaskStatuses).toHaveBeenCalledTimes(1);
      await expect(mockUpdateTaskStatuses).toHaveBeenCalledWith({
        status: "done",
        selectedTaskIds: mockContext.selectedTaskIds,
      } satisfies UpdateTaskStatusesInput);
    });

    await fireEvent(doneButton, new MouseEvent("mouseleave"));
  },
);

NoSelect.test(
  "何も選択されていないときにはメニューは表示されない",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);

    await waitForAnimation();

    const menu = canvas.queryByRole("toolbar");
    await expect(menu).not.toBeInTheDocument();
  },
);
