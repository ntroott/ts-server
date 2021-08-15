import { ProjectBuilder } from '~/libs/projectBuilder';
import { Util } from '~l/util';

describe('Test the root path', () => {
  test('сборка проекта', async () => {
    await Util.appBanner('test-one');
    await ProjectBuilder.build();
  });
  test('удаление временных файлов', async () => {
    await ProjectBuilder.clean();
  });
});
