import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import nodeExternals from 'webpack-node-externals';
import { WebpackPnpExternals } from 'webpack-pnp-externals';
import appRoot from 'app-root-path';
import ForkTSChecker from 'fork-ts-checker-webpack-plugin';
import GenPackageJson from 'generate-package-json-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { DefinePlugin, Configuration, WebpackPluginInstance } from 'webpack';
import PnpWebpackPlugin from 'pnp-webpack-plugin';
import yaml from 'js-yaml';
import fs from 'fs-extra';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import pck from '@/package.json';
import { include } from '@/tsconfig.json';

export default async (env): Promise<Configuration> => {
  process.env.NODE_CONFIG_STRICT_MODE = 'true';
  const NODE_ENV = env.NODE_ENV || process.env.NODE_ENV;
  process.env.NODE_ENV = NODE_ENV;
  const NODE_APP_INSTANCE = env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE;
  process.env.NODE_APP_INSTANCE = NODE_APP_INSTANCE;

  const config = (await import('config')).default.util.toObject();
  const entry = appRoot.resolve(config.build.entry);
  const yarnCfg = yaml.load(await fs.readFile(appRoot.resolve('.yarnrc.yml'), 'utf8')) as {
    nodeLinker: string;
    yarnPath: string;
    cacheFolder: string;
  };
  return {
    entry,
    mode: 'none',
    target: 'node',
    externals: [yarnCfg.nodeLinker === 'pnp' ? WebpackPnpExternals() : nodeExternals()],
    optimization: {
      emitOnErrors: false,
    },
    devtool: NODE_ENV === 'production' ? 'cheap-module-source-map' : 'source-map',
    output: {
      path: appRoot.resolve(path.join(config.build.outputDirs.dist, NODE_APP_INSTANCE)),
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
      plugins: [PnpWebpackPlugin],
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new DefinePlugin({
        'process.env.WEBPACK_BUNDLE': true,
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        'process.env.NODE_APP_INSTANCE': JSON.stringify(NODE_APP_INSTANCE),
        'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config)),
      }),
      new ForkTSChecker({
        typescript: { enabled: true, build: true },
        eslint: {
          enabled: true,
          files: include.filter((val) => /\.(ts|js)x?$/.test(val)),
        },
      }),
      new GenPackageJson({
        name: NODE_APP_INSTANCE,
        version: pck.version,
        description: config.description,
        main: 'index.js',
        author: pck.author,
        license: pck.license,
        packageManager: pck.packageManager,
      }) as WebpackPluginInstance,
      new CopyWebpackPlugin({
        patterns: [
          { from: 'yarn.lock' },
          { from: '.yarn/cache', to: '.yarn/cache' },
          { from: '.yarn/plugins', to: '.yarn/plugins' },
          { from: '.yarn/releases', to: '.yarn/releases' },
          { from: '.yarnrc.yml' },
        ],
      }),
    ],
  };
};
