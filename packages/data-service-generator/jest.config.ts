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
    "src/server/auth/token",
  ],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
  coverageDirectory: "../../coverage/packages/data-service-generator",
  coverageThreshold: {
    global: {
      branches: 89.32,
      lines: 92.43,
    },
  },
};
