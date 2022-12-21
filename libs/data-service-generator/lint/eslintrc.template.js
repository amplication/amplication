/** @type {import('eslint').Linter.ConfigOverride} */
module.exports = {
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
};
