/* eslint-disable */
export default {
  displayName: "amplication-client",
  preset: "../../jest.preset.js",
  transform: {
    "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "@nrwl/react/plugins/jest",
    "^.+\\.[tj]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  coverageDirectory: "../../coverage/packages/amplication-client",
  coverageThreshold: {
    global: {
      branches: 0,
      lines: 0,
    },
  },
};
