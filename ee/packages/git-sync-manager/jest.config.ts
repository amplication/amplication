/* eslint-disable */
export default {
  displayName: "git-sync-manager",
  preset: "../../../jest.preset.js",
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
  coverageDirectory: "../../../coverage/ee/packages/git-sync-manager",
  coverageThreshold: {
    global: {
      branches: 47.5,
      lines: 15,
    },
  },
};
