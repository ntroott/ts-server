import { getDockerfilePath } from './default';

export default {
  description: 'koa test',
  build: {
    entry: 'src/projects/koa-test/index.ts',
    swagger: {
      entry: 'src/projects/koa-test/swagger/index.yml',
      url: '/swagger',
    },
    sequelizeRoot: 'src/projects/koa-test/sequelize',
    dockerfile: getDockerfilePath('main'),
  },
  dbConfig: {
    database: 'koa_test',
  },
};
