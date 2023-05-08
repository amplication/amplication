/* eslint-disable */
export default {
  displayName: 'amplication-git-push-webhook-service',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/ee/packages/amplication-git-push-webhook-service',
  coverageThreshold: {
    global: {
      branches: 0,
      lines: 0,
    },
  },
};
