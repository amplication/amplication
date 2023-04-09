const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
  ...nxPreset,
  reporters: ["default", "github-actions"],
  coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.types.{ts,tsx}",
    "!**/*.template.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/*.e2e-spec.{ts,tsx}",
    "!**/tests/e2e/**",
    "!**/node_modules/**",
    "!**/amplication_modules/**",
    "!**/prisma/generated-prisma-client/**",
    "!**/scripts/**",
    "!**/jest.config.ts",
    "!**/index.ts",
    "!**/*.mock.ts",
    "!**/*.module.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      lines: 90,
    },
  },
};
