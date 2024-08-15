/* eslint-disable */
export default {
  displayName: "amplication-build-manager",
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
  coverageDirectory: "../../coverage/packages/amplication-build-manager",
  coverageThreshold: {
    global: {
      branches: 84.5,
      lines: 86,
    },
  },
};
