export default {
  displayName: "data-service-generator",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testEnvironment: "node",
  coverageProvider: "v8",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.template.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/*.e2e-spec.{ts,tsx}",
    "!**/node_modules/**",
  ],
  fakeTimers: {
    doNotFake: ["fast-glob"],
  },
  modulePathIgnorePatterns: [
    "lint",
    "generated",
    "src/server/static",
    "src/admin/static",
    "src/server/auth/token",
  ],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
};
