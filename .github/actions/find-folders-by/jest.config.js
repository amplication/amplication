module.exports = {
    clearMocks: true,
    moduleFileExtensions: ["js", "ts"],
    testEnvironment: "node",
    testMatch: ["**/*.spec.ts"],
    testRunner: "jest-circus/runner",
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    verbose: true
};