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
  // ADR-011: localStorage solo se accede a través del adaptador de persistencia compartido.
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    ignores: ["src/shared/persistence/**"],
    rules: {
      "no-restricted-globals": [
        "error",
        {
          name: "localStorage",
          message:
            "No accedas a localStorage directamente: usá el adaptador de persistencia de src/shared/persistence/ (ver ADR-011).",
        },
      ],
      "no-restricted-properties": [
        "error",
        {
          object: "window",
          property: "localStorage",
          message:
            "No accedas a window.localStorage directamente: usá el adaptador de persistencia de src/shared/persistence/ (ver ADR-011).",
        },
      ],
    },
  },
  // ADR-012: el store raíz compartido no puede depender de una feature.
  {
    files: ["src/shared/store/**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/features/**", "@/features/**"],
              message:
                "El store raíz no puede importar de una feature: el estado de negocio de una feature vive en su propio store dedicado (ver ADR-012).",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
