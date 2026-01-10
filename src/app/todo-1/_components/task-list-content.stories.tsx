import { TaskListContent } from "./task-list-content";
import { defaultStoryMeta } from "../story-meta";
import { initialTasks } from "../_backend/data";
import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  ...defaultStoryMeta,
  title: "Todo1/TaskListContent",
  component: TaskListContent,
});

export default meta;

export const Default = meta.story({
  args: { tasks: initialTasks, status: "success" },
});

export const Empty = meta.story({
  args: { tasks: [], status: "success" },
  decorators: [
    (Story) => {
      return (
        <div className="relative">
          <Story />
        </div>
      );
    },
  ],
});

export const Error = meta.story({
  args: { tasks: [], status: "error" },
  decorators: [
    (Story) => {
      return (
        <div className="relative">
          <Story />
        </div>
      );
    },
  ],
});
