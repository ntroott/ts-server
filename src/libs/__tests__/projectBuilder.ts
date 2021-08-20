import { ProjectBuilder } from '~/libs/projectBuilder';

describe('Test the root path', () => {
  test('сборка проекта', async () => {
    process.env.NODE_APP_INSTANCE = 'apollo-test';
    return ProjectBuilder.build();
  });
  test('удаление временных файлов', async () => {
    return ProjectBuilder.clean();
  });
  test('генерация исходников', async () => {
    return ProjectBuilder.generateSource();
  });
});
