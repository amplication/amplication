/* eslint-disable */
export default {
  displayName: "@amplication/util/git",
  preset: "../../../jest.preset.js",
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
  coverageDirectory: "../../../coverage/libs/util/git",
  coverageThreshold: {
    global: {
      branches: 79,
      lines: 46,
    },
  },
};
