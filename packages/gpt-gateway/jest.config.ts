/* eslint-disable */
export default {
  displayName: "gpt-gateway",
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
  coverageDirectory: "../../coverage/packages/gpt-gateway",
  coverageThreshold: {
    global: {
      branches: 15,
      lines: 3,
    },
  },
};
