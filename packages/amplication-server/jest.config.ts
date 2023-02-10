/* eslint-disable */
export default {
  displayName: "amplication-server",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  timers: "fake",
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/amplication-server",
};
