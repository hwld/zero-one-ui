import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/vrt",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  timeout: 120_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: "http://localhost:6006",
  },
  webServer: {
    command: "pnpm storybook --port 6006 --ci",
    port: 6006,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
