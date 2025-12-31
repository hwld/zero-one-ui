import { TaskTableFilter } from "./filter";
import { defaultStoryMeta } from "../../story-meta";
import { TaskTablePagingContext } from "./paging-provider";
import { useMemo } from "react";
import {
  clearAllMocks,
  expect,
  fn,
  userEvent,
  waitFor,
  within,
} from "storybook/test";
import { MockTaskTableProvider } from "./provider";
import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import preview from "../../../../../.storybook/preview";

const mockSetPage = fn();

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo2/TaskTableFilter",
  component: TaskTableFilter,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      const value = useMemo((): TaskTablePagingContext => {
        return {
          page: 0,
          limit: 0,
          setPage: mockSetPage,
          setLimit: () => {},
        };
      }, []);

      return (
        <ScrollableRootProvider>
          <MockTaskTableProvider mockPaging={value}>
            <Story />
          </MockTaskTableProvider>
        </ScrollableRootProvider>
      );
    },
  ],
  beforeEach: () => {
    clearAllMocks();
  },
});

export default meta;

export const Default = meta.story({});

Default.test(
  "フィルターを設定すると、ページが1に設定される",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const filterOpenButton = await canvas.findByRole("button", {
      name: "絞り込み",
    });

    await userEvent.click(filterOpenButton);

    await userEvent.click(
      await canvas.findByRole("menuitem", { name: "Todo" })
    );
    await userEvent.click(
      await canvas.findByRole("menuitem", { name: "Done" })
    );
    await userEvent.click(
      await canvas.findByRole("menuitem", { name: "未選択" })
    );

    await waitFor(async () => {
      await expect(mockSetPage).toHaveBeenCalledTimes(3);
      for (let i = 0; i < 3; i++) {
        await expect(mockSetPage).toHaveBeenNthCalledWith(i + 1, 1);
      }
    });
  }
);

Default.test(
  "フィルターを解除すると、ページが1に設定される",
  async ({ canvasElement }) => {
    const canvas = within(canvasElement.parentElement!);
    const filterOpenButton = await canvas.findByRole("button", {
      name: "絞り込み",
    });

    await userEvent.click(filterOpenButton);
    await userEvent.click(
      await canvas.findByRole("menuitem", { name: "Todo" })
    );
    await userEvent.click(
      await canvas.findByRole("menuitem", { name: "絞り込みを解除する" })
    );

    await waitFor(async () => {
      await expect(mockSetPage).toHaveBeenCalledTimes(2);
      await expect(mockSetPage).toHaveBeenCalledWith(1);
    });
  }
);
