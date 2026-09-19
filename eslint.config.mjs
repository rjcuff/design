import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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

  /*
   * Vendored from easeui, kept byte for byte so an upstream change can be
   * copied straight back over the top. This repo turns on react-hooks rules
   * that easeui does not, and satisfying them here would mean rewriting the
   * drag maths against a component we do not own. Scoped to the one file so
   * nothing written for this site loses the checks.
   */
  {
    files: ["app/components/drawer.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
