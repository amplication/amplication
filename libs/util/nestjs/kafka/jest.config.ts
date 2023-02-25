/* eslint-disable */
export default {
  displayName: "util-nestjs-kafka",
  preset: "../../../../jest.preset.js",
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
  coverageDirectory: "../../../../coverage/libs/util/nestjs/kafka",
  coverageThreshold: {
    global: {
      branches: 61.5,
      lines: 56.6,
    },
  },
};
