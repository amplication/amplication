/* eslint-disable */
export default {
  displayName: "notification-service",
  preset: "../../jest.preset.js",
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
  coverageDirectory: "../../coverage/packages/notification-service",
  coverageThreshold: {
    global: {
      branches: 70,
      lines: 80,
    },
  },
};
