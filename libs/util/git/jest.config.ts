/* eslint-disable */
export default {
  displayName: "@amplication/util/git",
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
  coverageDirectory: "../../../coverage/libs/util/git",
  coverageThreshold: {
    global: {
      branches: 84,
      lines: 46,
    },
  },
};
