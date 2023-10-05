/* eslint-disable */
export default {
  displayName: "amplication-code-gen-types",
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
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: From within the project directory, run "nx test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
};
