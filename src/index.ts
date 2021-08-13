import appRoot from 'app-root-path';
import pck from '@/tsconfig.json';
const a = 'test';

const first = () => {
  console.log('first(): factory evaluated');
  return function (target: object, propertyKey: string) {
    console.log('first(): called ' + target + propertyKey);
  };
};
class Test {
  @first()
  public test(text: string) {
    console.log(text);
    console.log(appRoot.resolve(text));
    console.log(pck);
  }
}

const obj = new Test();
obj.test(a);
