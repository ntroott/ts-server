import { ProjectBuilder } from '~/libs/projectBuilder';

describe('Test the root path', () => {
  test('генерация исходников', async () => {
    return ProjectBuilder.generateSource();
  });
  test('сборка проекта', async () => {
    process.env.NODE_APP_INSTANCE = 'test-one';
    return ProjectBuilder.build();
  });
  test('удаление временных файлов', async () => {
    return ProjectBuilder.clean();
  });
});
