/* eslint-disable */
export default {
  displayName: "amplication-git-pull-request-service",
  preset: "../../jest.preset.js",
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.spec.json",
    },
  },
  transform: {
    "^.+\\.[tj]s$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory:
    "../../coverage/packages/amplication-git-pull-request-service",
  coverageThreshold: {
    global: {
      branches: 48,
      lines: 25,
    },
  },
};
