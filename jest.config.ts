import type { Config } from '@jest/types';
process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = 'test';

const config: Config.InitialOptions = {
  testTimeout: 60000,
  verbose: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
  collectCoverage: true,
};
export default config;
