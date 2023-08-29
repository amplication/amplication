/* eslint-disable */
export default {
  displayName: "util-kafka",
  preset: "../../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../../coverage/libs/util/kafka",
  coverageThreshold: {
    global: {
      branches: 68.4,
      lines: 63.9,
    },
  },
};
