import "../src/app/globals.css";
import { definePreview } from "@storybook/nextjs-vite";
import { initialize, mswLoader } from "msw-storybook-addon";
import { PGliteProvider } from "../src/app/_providers/pglite-provider";
import type { Decorator } from "@storybook/react";

initialize();

const withPGlite: Decorator = (Story) => (
  <PGliteProvider>
    <Story />
  </PGliteProvider>
);

export default definePreview({
  addons: [],
  decorators: [withPGlite],
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
