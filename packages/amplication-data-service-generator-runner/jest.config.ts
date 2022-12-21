/* eslint-disable */
export default {
  displayName: "amplication-data-service-generator-runner",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../coverage/packages/amplication-data-service-generator-runner",
};
