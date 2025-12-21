import { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskListContent } from "./task-list-content";
import { defaultStoryMeta } from "../story-meta";
import { initialTasks } from "../_backend/data";

const meta = {
  ...defaultStoryMeta,
  title: "Todo1/TaskListContent",
  component: TaskListContent,
} satisfies Meta<typeof TaskListContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tasks: initialTasks, status: "success" },
};

export const Empty: Story = {
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
};

export const Error: Story = {
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
};
