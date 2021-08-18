require('./src/libs/tsPaths');
import gulp from 'gulp';
import mri from 'mri';
const args = mri(process.argv.slice(2));

process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = args.env || process.env.NODE_ENV;
process.env.NODE_APP_INSTANCE = args.app || process.env.NODE_APP_INSTANCE;

import { ProjectBuilder } from '~l/projectBuilder';
gulp.task('clean', ProjectBuilder.clean);
gulp.task('generate-source', ProjectBuilder.generateSource);
gulp.task('build', ProjectBuilder.build);
gulp.task('test', ProjectBuilder.test);
gulp.task(
  'build-project',
  gulp.series([ProjectBuilder.clean, ProjectBuilder.generateSource, ProjectBuilder.build])
);
gulp.task('build-docker-image', ProjectBuilder.buildDockerImage);
