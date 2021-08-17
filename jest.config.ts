import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import type { Config } from '@jest/types';
import { buildDirs } from '~l/projectBuilder';
process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = 'test';

export default async (): Promise<Config.InitialOptions> => {
  const dirs = await buildDirs;
  return {
    testTimeout: 60000,
    verbose: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
      '^.+\\.(ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
    collectCoverage: true,
    coverageDirectory: dirs.coverage,
  };
};