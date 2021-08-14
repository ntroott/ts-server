import { Util } from '~/libs/util';

describe('Test the root path', () => {
  test('Проверяем, что NODE_APP_INSTANCE меняется', async () => {
    await Util.appBanner('test-one');
    expect(process.env.NODE_APP_INSTANCE).toBe('test-one');
  });
  test('Проверяем, что конфиг меняется после первого вызова', async () => {
    const config = await Util.getMainConfig();
    expect(config.description).toBeDefined();
  });
});
