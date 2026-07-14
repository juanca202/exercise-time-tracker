import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    // Bare "node_modules"/".next" only match at the glob's own path segment,
    // not nested occurrences — use "**/" so dependency trees under any
    // subdirectory (e.g. sibling git worktrees checked out inside
    // .claude/worktrees/ in this sandbox) are never picked up as specs.
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/e2e/**",
      ".claude/worktrees/**",
    ],
    passWithNoTests: true,
  },
});
