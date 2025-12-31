import { ScrollableRootProvider } from "../../_providers/scrollable-root-provider";
import { defaultStoryMeta } from "../../story-meta";
import { LoadingTaskTable } from "./loading-task-table";
import { TaskTableProvider } from "./provider";
import preview from "../../../../../.storybook/preview";

const meta = preview.meta({
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
});

export default meta;

export const Default = meta.story({});
