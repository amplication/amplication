/** @type {import('eslint').Linter.ConfigOverride} */
module.exports = {
  files: ["**/static/**/*.ts"],
  rules: {
    ...require("./common-rules"),
    "import/no-unresolved": "off",
  },
};
