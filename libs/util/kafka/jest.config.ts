/* eslint-disable */
export default {
  displayName: "util-kafka",
  preset: "../../../jest.preset.js",
  globals: {},
  transform: {
    "^.+\\.[tj]s$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
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
