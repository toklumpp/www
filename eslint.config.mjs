/*
Copyright (c) 2026 Tobias Klumpp (https://www.toklumpp.net/)
SPDX-License-Identifier: MIT
*/
// @ts-check
import js from "@eslint/js";
import globals from "globals";

/** @type {import("eslint").Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      /** @type {import("eslint").Linter.LanguageOptions["globals"]} */
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Add any custom rules you want here
    },
  },
];
