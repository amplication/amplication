/* eslint-disable */
export default {
  displayName: "amplication-code-gen-types",
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
  coverageDirectory: "../../coverage/packages/amplication-code-gen-types",
  coverageThreshold: {
    global: {
      branches: 87,
      lines: 81,
    },
  },
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.types.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/*.e2e-spec.{ts,tsx}",
    "!**/types/**",
  ],
};
