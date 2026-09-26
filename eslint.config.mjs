/*
Copyright (c) 2026 Tobias Klumpp (https://www.toklumpp.net/)
SPDX-License-Identifier: MIT
*/
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Add any custom rules you want here
    },
  },
];
