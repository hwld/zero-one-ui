import { Meta } from "@storybook/nextjs-vite";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

export const defaultStoryMeta = {
  decorators: [
    (Story: React.FC) => {
      return (
        <DefaultQueryClientProvider>
          <Story />
        </DefaultQueryClientProvider>
      );
    },
  ],
} satisfies Meta<unknown>;
