import fs from 'fs-extra';
import appRoot from 'app-root-path';
import gulp from 'gulp';
import plumber from 'gulp-plumber';
import webpackStream from 'webpack-stream';
import shelljs from 'shelljs';
import wbConfig from '@/webpack.config';
import path from 'path';
import webpack from 'webpack';
import defConf from '@/config/default';

export class ProjectBuilder {
  public static get buildCfg() {
    return defConf.build;
  }
  public static async clean(): Promise<void> {
    const rmdir = async (dir: string): Promise<void> => {
      dir = appRoot.resolve(dir);
      if (await fs.pathExists(dir)) {
        await fs.rm(dir, { recursive: true, maxRetries: 5, retryDelay: 1 });
      }
    };
    const { dist, coverage } = defConf.build.outputDirs;
    await Promise.all([rmdir(dist), rmdir(coverage)]);
  }
  public static async build(): Promise<string> {
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
  public static test(): Promise<string> {
    return ProjectBuilder.execShell('NODE_OPTIONS=--experimental-vm-modules yarn jest --color');
  }
  public static async watch(): Promise<void> {
    const { dist } = ProjectBuilder.buildCfg.outputDirs;
    const output = appRoot.resolve(path.join(dist, process.env.NODE_APP_INSTANCE, 'index.js'));
    const cmd1 = `yarn nodemon --inspect ${output}`;
    const cmd2 =
      `yarn webpack --watch --env NODE_ENV=${process.env.NODE_ENV} ` +
      `--env NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE} ` +
      `--env FULL_BUILD=false`;
    ProjectBuilder.execShell(cmd2).then();
    ProjectBuilder.execShell(cmd1).then();
  }
  private static execShell(cmd: string, opts?: shelljs.ExecOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      shelljs.exec(cmd, opts, (code, stdout, stderr) => {
        if (!code) {
          resolve(stdout);
        } else {
          reject(stderr);
        }
      });
    });
  }
  public static async buildDockerImage(): Promise<string> {
    await ProjectBuilder.build();
    const { dockerfiles, outputDirs } = ProjectBuilder.buildCfg;
    const cmd =
      `docker build --tag ${process.env.NODE_ENV}-${process.env.NODE_APP_INSTANCE} ` +
      `--build-arg NODE_ENV=${process.env.NODE_ENV} ` +
      `--build-arg NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE} ` +
      `--build-arg DIST=${outputDirs.dist} ` +
      ` -f ${appRoot.resolve(dockerfiles.main)} .`;
    return ProjectBuilder.execShell(cmd);
  }
  public static async postgresUp(): Promise<void> {
    process.env.NODE_ENV = 'development';
    const conf = ProjectBuilder.buildCfg;
    let cmd = `docker build --tag dev-postgres-db -f ${appRoot.resolve(
      conf.dockerfiles.postgres
    )} .`;
    await ProjectBuilder.execShell(cmd);
    cmd = `docker run --name dev-postgres-db -i -d -p 5432:5432 dev-postgres-db `;
    await ProjectBuilder.execShell(cmd);
    cmd =
      `docker exec -i -u postgres dev-postgres-db sh -c ` +
      `"psql --command \\"CREATE USER admin WITH SUPERUSER PASSWORD '12345';\\""`;
    await ProjectBuilder.execShell(cmd);
  }
}
