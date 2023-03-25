/* eslint-disable */
export default {
  displayName: "amplication-server",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/amplication-server",
  testMatch: ["**/e2e/**/*.spec.ts"],
  collectCoverage: false,
};
