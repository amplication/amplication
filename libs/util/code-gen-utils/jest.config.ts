/* eslint-disable */
export default {
  displayName: "util-code-gen-utils",
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
  coverageDirectory: "../../../coverage/libs/util/code-gen-utils",
  coverageThreshold: {
    global: {
      branches: 83.33,
      lines: 59.76,
    },
  },
};
