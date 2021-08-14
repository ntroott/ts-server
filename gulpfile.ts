import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import gulp from 'gulp';
import fs from 'fs-extra';
import appRoot from 'app-root-path';
import mri from 'mri';
import webpackStream from 'webpack-stream';
import plumber from 'gulp-plumber';

process.env.NODE_CONFIG_STRICT_MODE = 'true';
const args = mri(process.argv.slice(2));
process.env.NODE_ENV = args.env || process.env.NODE_ENV;
process.env.NODE_APP_INSTANCE = args.app || process.env.NODE_APP_INSTANCE;

gulp.task('clean', async () => {
  const dist = appRoot.resolve('dist');
  const gen = appRoot.resolve('src/generated');
  const opts = { recursive: true, maxRetries: 5, retryDelay: 1 };
  if (await fs.pathExists(dist)) {
    await fs.rm(dist, opts);
  }
  if (await fs.pathExists(gen)) {
    await fs.rm(gen, opts);
  }
  await new (await import('~l/projectBuilder')).ProjectBuilder().genMainConfigInterface();
});
gulp.task('build', async () => {
  const wbConf = await (
    await import('@/webpack.config')
  ).default({
    NODE_ENV: process.env.NODE_ENV,
    NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE,
  });
  const webpack = appRoot.require('node_modules/webpack');
  await new Promise((resolve, reject) => {
    gulp
      .src(wbConf.entry as string)
      .pipe(plumber(reject))
      .pipe(webpackStream(wbConf, webpack))
      .pipe(gulp.dest(wbConf.output.path))
      .on('end', resolve)
      .on('error', reject);
  }).then();
});
