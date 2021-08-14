import yaml from 'js-yaml';
import fs from 'fs-extra';
import appRoot from 'app-root-path';
import path from 'path';
import deepExtend from 'deep-extend';
import interfaceDefinition from 'json-to-ts-interface';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpackStream from 'webpack-stream';
import wbConfig from '@/webpack.config';
import jest from 'gulp-jest';

export class ProjectBuilder {
  public static async genMainConfigInterface(): Promise<string> {
    const confDir = appRoot.resolve('config');
    const files = await fs.readdir(confDir);
    const obj = {};
    for (let i = 0; i < files.length - 1; i++) {
      deepExtend(obj, yaml.load(await fs.readFile(path.posix.join(confDir, files[i]), 'utf8')));
    }
    const genDir = appRoot.resolve('src/generated');
    await fs.mkdirp(genDir);
    let res = ('export ' + interfaceDefinition(obj)) as string;
    res = res.replace(/interface;/gm, 'interface');
    const pathToInterface = path.posix.join(genDir, 'config.d.ts');
    await fs.writeFile(pathToInterface, res);
    return pathToInterface;
  }
  public static async clean(): Promise<void> {
    const dist = appRoot.resolve('dist');
    const gen = appRoot.resolve('src/generated');
    const cov = appRoot.resolve('coverage');
    const rmdir = async (path: string) => {
      if (await fs.pathExists(path)) {
        await fs.rm(path, { recursive: true, maxRetries: 5, retryDelay: 1 });
      }
    };
    await Promise.all([rmdir(dist), rmdir(gen), rmdir(cov)]);
    await ProjectBuilder.genMainConfigInterface();
  }
  public static async build(): Promise<void> {
    const wbConf = await wbConfig({
      NODE_ENV: process.env.NODE_ENV,
      NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE,
    });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const webpack = require('webpack');
    return new Promise((resolve, reject) => {
      gulp
        .src(wbConf.entry as string)
        .pipe(plumber(reject))
        .pipe(webpackStream(wbConf, webpack))
        .pipe(gulp.dest(wbConf.output.path))
        .on('end', resolve)
        .on('error', reject);
    });
  }
  public static test(): NodeJS.ReadWriteStream {
    return gulp
      .src('./**/__tests__', { allowEmpty: true })
      .pipe(plumber())
      .pipe(
        jest({
          preprocessorIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
          automock: false,
        })
      );
  }
  public static buildDockerImage() {}
}
