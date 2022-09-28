const path = require("path");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "import"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "react-app",
    "react-app/jest",
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
      "eslint-import-resolver-lerna": {
        packages: path.resolve(__dirname, ".."),
      },
    },
  },
  overrides: [
    require("./lint/eslintrc.template.js"),
    require("./lint/eslintrc.static.js")
  ],
  rules: require("./lint/common-rules")
};
