/** @type {import('eslint').Linter.ConfigOverride} */
module.exports = {
  files: ["**/*.spec.ts"],
  rules: {
    ...require("./common-rules"),
    "@typescript-eslint/no-non-null-assertion": "off",
  },
};
