import { compilerOptions, include } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import nodeExternals from 'webpack-node-externals';
import appRoot from 'app-root-path';
import ForkTSChecker from 'fork-ts-checker-webpack-plugin';
import GenPackageJson from 'generate-package-json-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { DefinePlugin } from 'webpack';
import pck from '@/package.json';
import { ProjectBuilder } from '~/libs/projectBuilder';

process.env.NODE_CONFIG_STRICT_MODE = 'true';

export default async (env) => {
  process.env.NODE_ENV = env.NODE_ENV || process.env.NODE_ENV;
  process.env.NODE_APP_INSTANCE = env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE;
  await new ProjectBuilder().genMainConfigInterface();
  const util = new (await import('~/libs/util')).Util();
  const config = await util.getMainConfig();
  const entry = appRoot.resolve(config.build.entry);

  return {
    entry,
    mode: 'none',
    target: 'node',
    externals: [nodeExternals()],
    optimization: {
      emitOnErrors: false,
    },
    devtool: env.NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
    output: {
      path: appRoot.resolve(path.posix.join('dist', env.NODE_APP_INSTANCE)),
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
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.tsx'],
    },
    plugins: [
      new DefinePlugin({
        'process.env.BUNDLED': true,
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
        'process.env.NODE_APP_INSTANCE': JSON.stringify(env.NODE_APP_INSTANCE),
        'process.env.MAIN_CONFIG': JSON.stringify(JSON.stringify(config)),
      }),
      new ForkTSChecker({
        typescript: { enabled: true, build: true },
        eslint: {
          enabled: true,
          files: include.filter((val) => /\.(ts|js)x?$/.test(val)),
        },
      }),
      new GenPackageJson({
        name: env.NODE_APP_INSTANCE,
        version: pck.version,
        description: config.description,
        main: 'index.js',
        author: pck.author,
        license: pck.license,
      }),
      new CopyWebpackPlugin({ patterns: [{ from: 'package-lock.json' }] }),
    ],
  } as import('webpack').Configuration;
};
