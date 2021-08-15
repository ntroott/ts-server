import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import mri from 'mri';
import gulp from 'gulp';
import { ProjectBuilder } from '~l/projectBuilder';
const args = mri(process.argv.slice(2));

process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = args.env || process.env.NODE_ENV;
process.env.NODE_APP_INSTANCE = args.app || process.env.NODE_APP_INSTANCE;

gulp.task('clean', ProjectBuilder.clean);
gulp.task('build', ProjectBuilder.build);
gulp.task('test', ProjectBuilder.test);
gulp.task('build-project', gulp.series([ProjectBuilder.clean, ProjectBuilder.build]));
gulp.task('build-docker-image', ProjectBuilder.buildDockerImage);
