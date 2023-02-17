const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
  ...nxPreset,
  reporters: ["default", "github-actions"],
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.types.{ts,tsx}",
    "!**/*.template.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/*.e2e-spec.{ts,tsx}",
    "!**/node_modules/**",
    "!**/prisma/generated-prisma-client/**",
    "!**/scripts/**",
    "!**/jest.config.ts",
    "!**/index.ts",
  ],
};
