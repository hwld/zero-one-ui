import { PageCard } from "./page-card";
import { pages } from "./pages";
import preview from "../../.storybook/preview";

const meta = preview.meta({
  title: "Home/PageCard",
  component: PageCard,
  tags: ["autodocs"],
  parameters: { backgrounds: { default: "dark" } },
});

export default meta;

export const Default = meta.story({
  args: {
    number: 1,
    page: { ...pages[0], tags: ["LAYOUT", "MOBILE"] },
  },
});

export const Prime = meta.story({
  args: {
    number: 1,
    page: { ...pages[0], tags: ["PRIME"] },
  },
});
