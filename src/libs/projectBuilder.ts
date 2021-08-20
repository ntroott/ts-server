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
import _ from 'lodash';
import webpack from 'webpack';

export const buildDirs = (async () => {
  const configDir = appRoot.resolve('config');
  const dirs = _.get(
    yaml.load(await fs.readFile(path.join(configDir, 'default.yaml'), 'utf8')),
    'build.outputDirs'
  );
  return {
    configDir,
    dist: appRoot.resolve(dirs['dist']),
    coverage: appRoot.resolve(dirs['coverage']),
    generatedSrc: appRoot.resolve(dirs['generatedSrc']),
  };
})();
export class ProjectBuilder {
  public static async clean(): Promise<void> {
    const rmdir = async (path: string): Promise<void> => {
      if (await fs.pathExists(path)) {
        await fs.rm(path, { recursive: true, maxRetries: 5, retryDelay: 1 });
      }
    };
    const dirs = await buildDirs;
    await Promise.all([rmdir(dirs.dist), rmdir(dirs.coverage), rmdir(dirs.generatedSrc)]);
    return ProjectBuilder.generateSource();
  }
  public static async generateSource(): Promise<void> {
    const dirs = await buildDirs;
    const files = await fs.readdir(dirs.configDir);
    const obj = {};
    for (let i = 0; i < files.length - 1; i++) {
      deepExtend(obj, yaml.load(await fs.readFile(path.join(dirs.configDir, files[i]), 'utf8')));
    }
    await fs.mkdirp(dirs.generatedSrc);
    const outJson = path.join(dirs.generatedSrc, v1() + '.json');
    const outInterface = path.join(dirs.generatedSrc, 'runTimeConfig.d.ts');
    await fs.writeJson(outJson, obj);
    await ProjectBuilder.execShell(`yarn make_types -i ${outInterface} ${outJson} RunTimeConfig`);
    return fs.rm(outJson);
  }
  public static async build(): Promise<void> {
    await ProjectBuilder.generateSource();
    const wbConf = await wbConfig({
      NODE_ENV: process.env.NODE_ENV,
      NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE,
      FULL_BUILD: process.env.FULL_BUILD || 'true',
    });
    await new Promise((resolve, reject) => {
      gulp
        .src(wbConf.entry as string)
        .pipe(plumber(reject))
        .pipe(webpackStream(wbConf, webpack))
        .pipe(gulp.dest(wbConf.output.path))
        .on('end', resolve)
        .on('error', reject);
    });
    if (process.env.FULL_BUILD === 'true') {
      return ProjectBuilder.execShell(`cd ${wbConf.output.path} && yarn rebuild`, { silent: true });
    }
  }
  public static test(): Promise<void> {
    return ProjectBuilder.execShell('NODE_OPTIONS=--experimental-vm-modules yarn jest --color');
  }
  public static async watch(): Promise<void> {
    const dist = (await import('config')).default.get('build.outputDirs.dist') as string;
    const output = appRoot.resolve(path.join(dist, process.env.NODE_APP_INSTANCE, 'index.js'));
    const cmd1 = `yarn nodemon --inspect ${output}`;
    const cmd2 =
      `yarn webpack --watch --env NODE_ENV=${process.env.NODE_ENV} ` +
      `--env NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE} ` +
      `--env FULL_BUILD=false`;
    ProjectBuilder.execShell(cmd2).then();
    ProjectBuilder.execShell(cmd1).then();
  }
  private static execShell(cmd: string, opts?: shelljs.ExecOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      shelljs.exec(cmd, opts, (code, _stdout, stderr) => {
        if (!code) {
          resolve();
        } else {
          reject(stderr);
        }
      });
    });
  }
  public static async buildDockerImage(): Promise<void> {
    await ProjectBuilder.build();
    const cmd =
      `docker build --tag ${process.env.NODE_ENV}-${process.env.NODE_APP_INSTANCE} ` +
      //`--no-cache ` +
      `--build-arg NODE_ENV=${process.env.NODE_ENV} ` +
      `--build-arg NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE} ` +
      `--build-arg DIST=${(await import('config')).default.get('build.outputDirs.dist')} ` +
      ` -f dockerfiles/deploy .`;
    return ProjectBuilder.execShell(cmd);
  }
}
