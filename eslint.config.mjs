import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import storybook from "eslint-plugin-storybook";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";

export default defineConfig(
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static",
  ]),
  {
    extends: [
      nextVitals,
      nextTs,
      storybook.configs["flat/recommended"],
      prettier,
      eslintPluginBetterTailwindcss.configs.recommended,
    ],

    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/app/globals.css",
      },
    },
  },
  {
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "`lib/fetcher`を使用してください",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      // TODO: https://github.com/facebook/react/issues/34775 が解決するのを待つ
      "react-hooks/refs": "off",
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  }
);
