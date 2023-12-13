/* eslint-disable */
export default {
  displayName: "data-service-generator-catalog",
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
  coverageDirectory: "../../coverage/packages/data-service-generator-catalog",
  coverageThreshold: {
    global: {
      branches: 57,
      lines: 30,
    },
  },
};
