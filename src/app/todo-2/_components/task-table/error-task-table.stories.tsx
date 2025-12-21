import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { defaultStoryMeta } from "../../story-meta";
import { ErrorTaskTable } from "./error-task-table";
import { Meta, StoryObj } from "@storybook/nextjs";
import { TaskTableProvider } from "./provider";

const meta = {
  ...defaultStoryMeta,
  title: "Todo2/ErrorTaskTable",
  component: ErrorTaskTable,
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
} satisfies Meta<typeof ErrorTaskTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
