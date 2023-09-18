export default {
  displayName: "data-service-generator",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  fakeTimers: {
    doNotFake: ["fast-glob"],
  },
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "lint",
    "generated",
    "src/server/static",
    "src/admin/static",
  ],
  testPathIgnorePatterns: ["amplication_modules", "tests/e2e"],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
  coverageDirectory: "../../coverage/packages/data-service-generator",
  coverageThreshold: {
    global: {
      branches: 87,
      lines: 90,
    },
  },
};
