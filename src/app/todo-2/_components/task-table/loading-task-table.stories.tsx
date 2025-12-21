import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { defaultStoryMeta } from "../../story-meta";
import { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingTaskTable } from "./loading-task-table";
import { TaskTableProvider } from "./provider";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/LoadingTaskTable",
  component: LoadingTaskTable,
  decorators: [
    ...defaultStoryMeta.decorators,
    (Story) => {
      return (
        <ScrollableRootProvider>
          <TaskTableProvider>
            <div className="flex h-[450px]">
              <Story />
            </div>
          </TaskTableProvider>
        </ScrollableRootProvider>
      );
    },
  ],
} satisfies Meta<typeof LoadingTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
