import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './src',
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/$1',
    '^@modules/(.*)$': '<rootDir>/modules/$1',
  },
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

export default config;
