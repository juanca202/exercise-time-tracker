import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  // Bare patterns only match at the repo root, not nested occurrences — use
  // "**/" so build artifacts under any subdirectory (e.g. sibling git
  // worktrees checked out inside .claude/worktrees/ in this sandbox) are
  // never linted.
  globalIgnores([
    // Default ignores of eslint-config-next:
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/next-env.d.ts",
    ".claude/worktrees/**",
  ]),
  eslintConfigPrettier,
]);

export default eslintConfig;
