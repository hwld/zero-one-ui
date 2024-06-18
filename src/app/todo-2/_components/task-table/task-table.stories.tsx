import { Meta, StoryObj } from "@storybook/react";
import { TaskTable } from "./task-table";
import { defaultStoryMeta } from "../../story-meta";
import {
  MockTaskSelectionProvider,
  TaskSelectionContext,
} from "../../_contexts/task-selection-provider";
import { TasksProvider } from "../../_contexts/tasks-provider";
import { initialTasks } from "../../_mocks/data";
import {
  MockTaskSortProvider,
  TaskSortContext,
} from "../../_contexts/task-sort-provider";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "@storybook/test";
import { SortEntry } from "../../_mocks/api";
import { getNextSortOrder } from "./header";
import { useState } from "react";
import { TaskPagingProvider } from "../../_contexts/task-paging-provider";

const dummyTasks = initialTasks.slice(0, 10);

const mockSelectTasks = fn();
const mockUnselectTasks = fn();

const mockSort = fn();
const mockSortContext: TaskSortContext = {
  sortEntry: { field: "createdAt", order: "desc" },
  sort: mockSort,
};

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/TaskTable",
  component: TaskTable,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      const [selectedIds, setSelectedIds] = useState<string[]>([]);

      const mockSelectionContext: TaskSelectionContext = {
        selectedTaskIds: selectedIds,
        selectTaskIds: (ids) => {
          mockSelectTasks(ids);
          setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
        },
        unselectTaskIds: (ids) => {
          mockUnselectTasks(ids);
          setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        },
        toggleTaskSelection: () => {},
        unselectAllTasks: () => {},
      };

      return (
        <TaskPagingProvider>
          <TasksProvider>
            <MockTaskSelectionProvider value={mockSelectionContext}>
              <MockTaskSortProvider value={mockSortContext}>
                <Story />
              </MockTaskSortProvider>
            </MockTaskSelectionProvider>
          </TasksProvider>
        </TaskPagingProvider>
      );
    },
  ],
} satisfies Meta<typeof TaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { paginatedTasks: dummyTasks, totalPages: 2 },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement.parentElement!);

    await step("各項目でソートすることができる", async () => {
      const sortTitle = await canvas.findByRole("button", { name: "タスク名" });
      const sortCreatedAt = await canvas.findByRole("button", {
        name: "作成日",
      });
      const sortCompletedAt = await canvas.findByRole("button", {
        name: "達成日",
      });

      await userEvent.click(sortTitle);
      await userEvent.click(sortCreatedAt);
      await userEvent.click(sortCompletedAt);

      await waitFor(async () => {
        const { sortEntry } = mockSortContext;

        await expect(mockSort).toHaveBeenCalledTimes(3);

        const fields: SortEntry["field"][] = [
          "title",
          "createdAt",
          "completedAt",
        ];
        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          await expect(mockSort).toHaveBeenNthCalledWith(i + 1, {
            field,
            order: getNextSortOrder(sortEntry, field),
          } satisfies SortEntry);
        }
      });

      clearAllMocks();
    });

    await step("現在のページのタスクを全選択・選択解除できる", async () => {
      const selectInput = await canvas.findByRole("checkbox", {
        name: "すべてを選択・選択解除",
      });

      await userEvent.click(selectInput);
      await userEvent.click(selectInput);

      await waitFor(async () => {
        await expect(mockSelectTasks).toHaveBeenCalledTimes(1);
        await expect(mockSelectTasks).toHaveBeenCalledWith(
          dummyTasks.map((t) => t.id),
        );
        await expect(mockUnselectTasks).toHaveBeenCalledTimes(1);
        await expect(mockUnselectTasks).toHaveBeenCalledWith(
          dummyTasks.map((t) => t.id),
        );
      });
    });
  },
};

export const Empty: Story = {
  args: { paginatedTasks: [], totalPages: 1 },
};
