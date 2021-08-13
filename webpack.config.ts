import nodeExternals from 'webpack-node-externals';
import appRoot from 'app-root-path';
import ForkTSChecker from 'fork-ts-checker-webpack-plugin';
import GenPackageJson from 'generate-package-json-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { include } from '@/tsconfig.json';
import pck from '@/package.json';

const entry = appRoot.resolve('src/index.ts');

module.exports = {
  entry,
  mode: 'none',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: appRoot.resolve('dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: entry,
        use: {
          loader: 'imports-loader',
          options: { imports: ['side-effects reflect-metadata'] },
        },
      },
      {
        test: /\.(ts|js)x?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json', '.tsx'],
  },
  plugins: [
    new ForkTSChecker({
      typescript: { enabled: true, build: true },
      eslint: {
        enabled: true,
        files: include.filter((val) => /\.(ts|js)x?$/.test(val)),
      },
    }),
    new GenPackageJson({
      name: pck.name,
      version: pck.version,
      description: pck.description,
      main: 'index.js',
      author: pck.author,
      license: pck.license,
    }),
    new CopyWebpackPlugin({ patterns: [{ from: 'package-lock.json' }] }),
  ],
} as import('webpack').Configuration;
