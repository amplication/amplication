/* eslint-disable */
export default {
  displayName: "amplication-storage-gateway",
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
  coverageDirectory: "../../coverage/packages/amplication-storage-gateway",
  coverageThreshold: {
    global: {
      branches: 40,
      lines: 9,
    },
  },
};
