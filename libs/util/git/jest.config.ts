/* eslint-disable */
export default {
  displayName: "@amplication/util/git",
  preset: "../../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../../coverage/libs/util/git",
  coverageThreshold: {
    global: {
      branches: 31.25,
      lines: 25,
    },
  },
};
