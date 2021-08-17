import appRoot from 'app-root-path';
import pck from '@/tsconfig.json';
const a = 'test';

import { RunTimeConfig } from '~l/runTimeConfig';

RunTimeConfig.set('test-two');
const first = () => {
  console.log('first(): factory evaluated');
  return function (target: object, propertyKey: string) {
    console.log('first(): called ' + target + propertyKey);
  };
};
interface ITest {
  test: (text: string) => void;
}
class Test implements ITest {
  @first()
  public test(text) {
    console.log(text);
    console.log(appRoot.resolve(text));
    console.log(pck);
  }
}

const obj = new Test();
obj.test(a);
