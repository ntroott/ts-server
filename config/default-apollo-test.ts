import { getDockerfilePath } from './default';

export default {
  description: 'apollo test',
  build: {
    entry: 'src/projects/apollo-test/index.ts',
    dockerfile: getDockerfilePath('main'),
    sequelizeRoot: 'src/projects/apollo-test/sequelize',
  },
  dbConfig: {
    database: 'apollo_test',
  },
};
