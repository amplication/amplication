/* eslint-disable */
export default {
  displayName: "util-logging",
  preset: "../../../jest.preset.js",
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
  coverageDirectory: "../../../coverage/libs/util/logging",
  coverageThreshold: {
    global: {
      branches: 92.85,
      lines: 80.98,
    },
  },
};
