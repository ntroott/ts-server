import { RunTimeConfig } from '~l/runTimeConfig';

describe('Test the root path', () => {
  test('set config', () => {
    RunTimeConfig.set('apollo-test');
  });
  test('get config', () => {
    expect(RunTimeConfig.get()).toBeDefined();
  });
});
