const path = require("path");

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
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "eslint-import-resolver-lerna": {
        packages: path.resolve(__dirname, ".."),
      },
    },
  },
  overrides: [
    {
      files: ["*.template.ts", "*.template.tsx"],
      rules: {
        "@typescript-eslint/no-empty-interface": "off",
        "import/no-unresolved": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "default",
            format: ["camelCase"],
          },
          {
            selector: "variable",
            modifiers: ["const"],
            format: ["camelCase", "UPPER_CASE"],
          },
          {
            selector: "property",
            format: ["camelCase", "UPPER_CASE"],
          },
          {
            selector: "method",
            format: ["camelCase", "UPPER_CASE"],
          },
          {
            selector: "variable",
            modifiers: ["const"],
            types: ["function"],
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
          },
          {
            selector: "typeLike",
            format: ["PascalCase", "UPPER_CASE"],
          },
          { selector: "enumMember", format: ["PascalCase"] },
        ],
      },
    },
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "import/no-cycle": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "default",
        format: ["camelCase"],
      },
      {
        selector: "variable",
        modifiers: ["const"],
        format: ["camelCase", "UPPER_CASE"],
      },
      {
        selector: "property",
        format: ["camelCase", "UPPER_CASE"],
      },
      {
        selector: "variable",
        modifiers: ["const"],
        types: ["function"],
        format: ["camelCase", "PascalCase"],
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      { selector: "enumMember", format: ["PascalCase"] },
    ],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    "@typescript-eslint/no-floating-promises": "error",
  },
};
