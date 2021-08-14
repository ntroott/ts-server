import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import gulp from 'gulp';
import mri from 'mri';
import { ProjectBuilder } from '~l/projectBuilder';

process.env.NODE_CONFIG_STRICT_MODE = 'true';
const args = mri(process.argv.slice(2));
process.env.NODE_ENV = args.env || process.env.NODE_ENV;
process.env.NODE_APP_INSTANCE = args.app || process.env.NODE_APP_INSTANCE;

gulp.task('clean', ProjectBuilder.clean);
gulp.task('build', ProjectBuilder.build);
gulp.task('test', ProjectBuilder.test);
gulp.task(
  'build-project',
  gulp.series([ProjectBuilder.clean, ProjectBuilder.test, ProjectBuilder.build])
);
