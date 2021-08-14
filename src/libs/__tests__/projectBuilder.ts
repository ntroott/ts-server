import { ProjectBuilder } from '~/libs/projectBuilder';
import { Util } from '~l/util';
import fs from 'fs-extra';

describe('Test the root path', () => {
  test('генерация интерфейса для конфига', async () => {
    const pathToInterfaces = await ProjectBuilder.genMainConfigInterface();
    expect(await fs.pathExists(pathToInterfaces)).toBe(true);
  });
  test('сборка проекта', async () => {
    await Util.appBanner('test-one');
    await ProjectBuilder.build();
  });
  test('удаление временных файлов', async () => {
    await ProjectBuilder.clean();
  });
});
