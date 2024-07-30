/* eslint-disable */
export default {
  displayName: "amplication-git-pull-service",
  preset: "../../../jest.preset.js",
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
  coverageDirectory:
    "../../../coverage/ee/packages/amplication-git-pull-service",
  coverageThreshold: {
    global: {
      branches: 13.04,
      lines: 1.84,
    },
  },
};
