/* eslint-disable */
export default {
  displayName: "util-dsg-utils",
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
  coverageDirectory: "../../../coverage/libs/util/dsg-utils",
  coverageThreshold: {
    global: {
      branches: 50,
      lines: 50,
    },
  },
};
