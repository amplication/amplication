export default {
  displayName: "data-service-generator",
  rootDir: "..",
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  moduleFileExtensions: ["js", "json", "ts"],
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  testTimeout: 100000000,
};
