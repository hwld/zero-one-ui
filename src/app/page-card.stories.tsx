import type { Meta, StoryObj } from "@storybook/nextjs";
import { PageCard } from "./page-card";
import { pages } from "./pages";

const meta = {
  title: "Home/PageCard",
  component: PageCard,
  tags: ["autodocs"],
  parameters: { backgrounds: { default: "dark" } },
} satisfies Meta<typeof PageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    number: 1,
    page: { ...pages[0], tags: ["LAYOUT", "MOBILE"] },
  },
};

export const Prime: Story = {
  args: {
    number: 1,
    page: { ...pages[0], tags: ["PRIME"] },
  },
};
