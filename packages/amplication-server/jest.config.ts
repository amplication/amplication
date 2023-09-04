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
  fakeTimers: {
    enableGlobally: true,
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/amplication-server",
  coverageThreshold: {
    global: {
      branches: 80,
      lines: 50,
    },
  },
};
