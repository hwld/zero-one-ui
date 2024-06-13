import { Meta, StoryObj } from "@storybook/react";
import { TaskListContent } from "./task-list-content";
import { defaultStoryMeta } from "../story-meta";
import { initialTasks } from "../_mocks/data";

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
};

export const Error: Story = {
  args: { tasks: [], status: "error" },
};
