/* eslint-disable */
export default {
  displayName: "amplication-server",
  preset: "../../jest.preset.js",
  globals: {},
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/amplication-server",
  testMatch: ["**/e2e/**/*.spec.ts"],
  collectCoverage: false,
};
