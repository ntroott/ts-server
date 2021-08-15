import fs from 'fs-extra';
import appRoot from 'app-root-path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpackStream from 'webpack-stream';
import shelljs from 'shelljs';
import wbConfig from '@/webpack.config';
import path from 'path';
import yaml from 'js-yaml';
import deepExtend from 'deep-extend';
import { v1 } from 'uuid';

export class ProjectBuilder {
  public static async clean(): Promise<void[]> {
    const rmdir = async (path: string): Promise<void> => {
      path = appRoot.resolve(path);
      if (await fs.pathExists(path)) {
        await fs.rm(path, { recursive: true, maxRetries: 5, retryDelay: 1 });
      }
    };
    return Promise.all([rmdir('dist'), rmdir('coverage'), rmdir('src/generated')]);
  }
  public static async generateSource(): Promise<void> {
    const confDir = appRoot.resolve('config');
    const files = await fs.readdir(confDir);
    const obj = {};
    for (let i = 0; i < files.length - 1; i++) {
      deepExtend(obj, yaml.load(await fs.readFile(path.posix.join(confDir, files[i]), 'utf8')));
    }
    const genDir = appRoot.resolve('src/generated');
    await fs.mkdirp(genDir);
    const outJson = path.join(genDir, v1() + '.json');
    const outInterface = path.join(genDir, 'runTimeConfig.d.ts');
    await fs.writeJson(outJson, obj);
    await ProjectBuilder.execShell(`npx make_types -i ${outInterface} ${outJson} RunTimeConfig`);
    return fs.rm(outJson);
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
  public static test(): Promise<void> {
    return ProjectBuilder.execShell('NODE_OPTIONS=--experimental-vm-modules npx jest --color');
  }
  private static execShell(cmd: string): Promise<void> {
    return new Promise((resolve, reject) => {
      shelljs.exec(cmd, (code, _stdout, stderr) => {
        if (!code) {
          resolve();
        } else {
          reject(stderr);
        }
      });
    });
  }
  public static async buildDockerImage(): Promise<void> {
    const cmd =
      `docker build --tag ${process.env.NODE_ENV}-${process.env.NODE_APP_INSTANCE} ` +
      `--build-arg NODE_ENV=${process.env.NODE_ENV} ` +
      `--build-arg NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE} ` +
      ` .`;
    return ProjectBuilder.execShell(cmd);
  }
}
