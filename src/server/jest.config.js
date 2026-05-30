/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '../../',
  testMatch: ['<rootDir>/tests/server/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/server/src/$1',
  },
  coverageDirectory: 'coverage/server',
  collectCoverageFrom: [
    'src/server/src/**/*.ts',
    '!src/server/src/index.ts',
  ],
  coverageThresholds: {
    global: {
      lines: 80,
      functions: 80,
    },
  },
};
