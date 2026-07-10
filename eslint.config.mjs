import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  eslintConfigPrettier,
  {
    // ADR-011: la persistencia local usa localStorage vía el middleware
    // `persist` de Zustand; no se introduce IndexedDB ni wrappers como
    // dexie/idb.
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "indexedDB",
          message:
            "ADR-011: la persistencia local usa localStorage (vía el middleware `persist` de Zustand), no IndexedDB.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "dexie",
              message:
                "ADR-011: la persistencia local usa localStorage, no Dexie/IndexedDB.",
            },
            {
              name: "idb",
              message:
                "ADR-011: la persistencia local usa localStorage, no idb/IndexedDB.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
