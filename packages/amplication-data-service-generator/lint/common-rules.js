/** @type {import('eslint').Linter.RulesRecord} */
module.exports = {
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/interface-name-prefix": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "import/no-cycle": "off",
  "import/no-unresolved": "error",
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
};
