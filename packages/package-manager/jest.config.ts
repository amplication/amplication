/* eslint-disable */
export default {
  displayName: "package-manager",
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
  coverageDirectory: "../../coverage/packages/package-manager",
  coverageThreshold: {
    global: {
      branches: 87,
      lines: 89,
    },
  },
};
