import { Meta } from "@storybook/nextjs-vite";
import { DefaultQueryClientProvider } from "../_providers/default-query-client-provider";

export const defaultStoryMeta = {
  globals: {
    backgrounds: { value: "dark" },
  },
  decorators: [
    (Story: React.FC) => {
      return (
        <DefaultQueryClientProvider>
          <div className="h-full text-zinc-200">
            <Story />
          </div>
        </DefaultQueryClientProvider>
      );
    },
  ],
} satisfies Meta<unknown>;
