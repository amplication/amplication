export default {
  displayName: "data-service-generator",
  preset: "../../jest.preset.js",
  globals: {},
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testMatch: ["**/e2e/**/*.spec.ts"],
  testTimeout: 100000000,
  maxConcurrency: 2,
  collectCoverage: false,
};
