/* eslint-disable */
export default {
  displayName: "gpt-gateway",
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
  coverageDirectory: "../../coverage/packages/gpt-gateway",
  coverageThreshold: {
    global: {
      branches: 15,
      lines: 3,
    },
  },
};
