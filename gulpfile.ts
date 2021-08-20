import { compilerOptions } from './tsconfig.json';
import { register } from 'tsconfig-paths';
register({ baseUrl: './', paths: compilerOptions.paths });
import gulp from 'gulp';
import mri from 'mri';
const args = mri(process.argv.slice(2));

process.env.NODE_CONFIG_STRICT_MODE = 'true';
process.env.NODE_ENV = args.env || process.env.NODE_ENV;
process.env.NODE_APP_INSTANCE = args.app || process.env.NODE_APP_INSTANCE;
process.env.FULL_BUILD = args.build || process.env.FULL_BUILD || 'true';

import { ProjectBuilder } from '~l/projectBuilder';
gulp.task('clean', ProjectBuilder.clean);
gulp.task('generate-source', ProjectBuilder.generateSource);
gulp.task('build', ProjectBuilder.build);
gulp.task('test', ProjectBuilder.test);
gulp.task('watch', ProjectBuilder.watch);
gulp.task('build-docker-image', ProjectBuilder.buildDockerImage);
