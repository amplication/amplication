/* eslint-disable */
export default {
  displayName: "amplication-git-pull-request-service",
  preset: "../../jest.preset.js",
  globals: {},
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
    "../../coverage/packages/amplication-git-pull-request-service",
  coverageThreshold: {
    global: {
      branches: 48,
      lines: 25,
    },
  },
};
