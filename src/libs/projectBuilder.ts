import fs from 'fs-extra';
import appRoot from 'app-root-path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpackStream from 'webpack-stream';
import shelljs from 'shelljs';
import wbConfig from '@/webpack.config';

export class ProjectBuilder {
  public static async clean(): Promise<void> {
    const dist = appRoot.resolve('dist');
    const cov = appRoot.resolve('coverage');
    const rmdir = async (path: string) => {
      if (await fs.pathExists(path)) {
        await fs.rm(path, { recursive: true, maxRetries: 5, retryDelay: 1 });
      }
    };
    await Promise.all([rmdir(dist), rmdir(cov)]);
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
    return ProjectBuilder.execShell('npx jest');
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
      `--build-arg APP_ENV=${process.env.NODE_ENV} ` +
      `--build-arg APP_NAME=${process.env.NODE_APP_INSTANCE} ` +
      ` .`;
    return ProjectBuilder.execShell(cmd);
  }
}
