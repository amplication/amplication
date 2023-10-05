export default {
  displayName: "data-service-generator",
  preset: "../../jest.preset.js",
  globals: {},
  fakeTimers: {
    doNotFake: ["fast-glob"],
  },
  testEnvironment: "node",
  modulePathIgnorePatterns: [
    "lint",
    "generated",
    "src/server/static",
    "src/admin/static",
  ],
  testPathIgnorePatterns: ["amplication_modules", "tests/e2e"],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
  coverageDirectory: "../../coverage/packages/data-service-generator",
  coverageThreshold: {
    global: {
      branches: 87,
      lines: 90,
    },
  },
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
