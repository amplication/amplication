/* eslint-disable */
export default {
  displayName: "amplication-nest-logger-module",
  preset: "../../../../jest.preset.js",
  globals: {},
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../../coverage/libs/util/nestjs/logging",
  coverageThreshold: {
    global: {
      branches: 75,
      lines: 67.74,
    },
  },
};
