/* eslint-disable */
export default {
  displayName: "amplication-git-utils",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/amplication-git-utils",
  coverageThreshold: {
    global: {
      branches: 31.25,
      lines: 25,
    },
  },
};
