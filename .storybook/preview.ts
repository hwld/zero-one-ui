import "../src/app/globals.css";
import { definePreview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";

initialize();

export default definePreview({
  addons: [],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
  tags: [],
});
