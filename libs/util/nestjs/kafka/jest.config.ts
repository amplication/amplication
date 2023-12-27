/* eslint-disable */
export default {
  displayName: "util-nestjs-kafka",
  preset: "../../../../jest.preset.js",
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
  coverageDirectory: "../../../../coverage/libs/util/nestjs/kafka",
  coverageThreshold: {
    global: {
      branches: 61.5,
      lines: 56.6,
    },
  },
};
