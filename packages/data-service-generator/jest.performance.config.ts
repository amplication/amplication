export default {
  displayName: "data-service-generator-performance",
  preset: "../../jest.preset.js",
  globals: {},
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  testMatch: ["**/performance/**/*.spec.ts"],
  collectCoverage: false,
  maxWorkers: 1,
};
