import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
