export default {
  displayName: "generator-blueprints",
  preset: "../../jest.preset.js",
  globals: {},
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testMatch: ["**/e2e/**/*.spec.ts"],
  testTimeout: 100000000,
  maxConcurrency: 2,
  collectCoverage: false,
};
