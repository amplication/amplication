/* eslint-disable */
export default {
  displayName: "amplication-server",
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
  fakeTimers: {
    enableGlobally: true,
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/packages/amplication-server",
  coverageThreshold: {
    global: {
      branches: 83,
      lines: 53.7,
    },
  },
};
