/* eslint-disable */
export default {
  displayName: "data-service-generator-catalog",
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
  coverageDirectory: "../../coverage/packages/data-service-generator-catalog",
  coverageThreshold: {
    global: {
      branches: 59,
      lines: 29,
    },
  },
  collectCoverageFrom: [
    "**/src/**/*.{ts,tsx}",
    "!**/*.types.{ts,tsx}",
    "!**/*.template.{ts,tsx}",
    "!**/*.spec.{ts,tsx}",
    "!**/*.e2e-spec.{ts,tsx}",
    "!**/tests/e2e/**",
    "!**/health/**",
    "!**/index.ts",
    "!**/*.mock.ts",
    "!**/*.module.ts",
    "!**/*.interface.ts",
    "!**/dto/*.ts",
    "!**/*.dto.ts",
    "!**/main.ts",
    "!**/base/**",
  ],
};
