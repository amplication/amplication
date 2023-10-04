/* eslint-disable */
export default {
  displayName: "amplication-plugin-api",
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
  coverageDirectory: "../../coverage/packages/amplication-plugin-api",
  coverageThreshold: {
    global: {
      branches: 4,
      lines: 0.82,
    },
  },
};
