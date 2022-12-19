/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "libs/data-service-generator/tsconfig.*?.json",
    sourceType: "module",
  },
  ignorePatterns: [
    "test",
    "src/tests/__snapshots__",
    "scripts",
    // Static and template files should not be linted
    "src/**/*.template.*",
    "src/**/static/**/*",
    // React Admin UI public files
    "src/admin/public-files",
  ],
  plugins: ["@typescript-eslint/eslint-plugin", "import"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  root: true,
  env: {
    node: true,
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["."],
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      },
    },
  },
  overrides: [
    require("./lint/eslintrc.spec.js"),
    require("./lint/eslintrc.template.js"),
    require("./lint/eslintrc.static.js"),
  ],
  rules: {
    ...require("./lint/common-rules"),
  },
};
