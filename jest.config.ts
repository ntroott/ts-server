import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import { Config } from '@jest/types';
import { ProjectBuilder } from '~l/projectBuilder';
process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = 'test';

export default async (): Promise<Config.InitialOptions> => {
  return {
    testTimeout: 60000,
    verbose: true,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
      '^.+\\.(ts|tsx)$': 'babel-jest',
    },
    testMatch: ['**/__tests__/*.+(ts|tsx|js)'],
    collectCoverage: false,
    coverageDirectory: ProjectBuilder.buildCfg.outputDirs.coverage,
    resolver: require.resolve(`jest-pnp-resolver`),
  };
};
