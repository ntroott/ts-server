import { RunTimeConfig } from '~l/runTimeConfig';

describe('Test the root path', () => {
  test('set config', () => {
    RunTimeConfig.set('test-two');
  });
  test('get config', () => {
    expect(RunTimeConfig.get()).toBeDefined();
  });
});
