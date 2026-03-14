import { defineConfig } from "vite-plus";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
import { playwright } from "vite-plus/test/browser-playwright";

const dirname =
  typeof __dirname !== "undefined" ? __dirname : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  lint: {
    categories: { correctness: "warn" },
    plugins: ["oxc", "typescript", "react", "nextjs", "import", "jsx-a11y", "unicorn"],
    env: {
      builtin: true,
      browser: true,
      node: true,
    },
    ignorePatterns: [".next/**", "out/**", "build/**", "next-env.d.ts", "storybook-static"],
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/app/globals.css",
      },
    },
    rules: {
      "import/no-anonymous-default-export": "warn",
      "jsx-a11y/alt-text": [
        "warn",
        {
          elements: ["img"],
          img: ["Image"],
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "`lib/fetcher`を使用してください",
        },
      ],
      "no-unused-expressions": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "react-hooks/exhaustive-deps": "warn",
      // TODO: https://github.com/facebook/react/issues/34775 が解決するのを待つ
      "react-hooks/refs": "off",
      "react-hooks/rules-of-hooks": "error",
    },
    overrides: [
      {
        // better-tailwindcss
        files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
        jsPlugins: ["eslint-plugin-better-tailwindcss"],
        rules: {
          ...eslintPluginBetterTailwindcss.configs.recommended.rules,
          "better-tailwindcss/enforce-consistent-line-wrapping": "off",
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
          setupFiles: [".storybook/vitest.setup.ts"],
        },
      },
    ],
  },
  staged: {
    "*.{js,ts,jsx,tsx,mjs,mts,cts}": "vp fmt --write",
  },
});
