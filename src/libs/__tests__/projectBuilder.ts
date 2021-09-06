import { ProjectBuilder } from '~/libs/projectBuilder';

describe('Test the root path', () => {
  test('сборка проекта', async () => {
    process.env.NODE_APP_INSTANCE = (await ProjectBuilder.getProjectNameList())[0];
    return ProjectBuilder.build();
  });
  test('удаление временных файлов', async () => {
    return ProjectBuilder.clean();
  });
});
