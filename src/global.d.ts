declare module 'config' {
  interface IUtil {
    util: {
      toObject: () => { [key: string]: { [key: string]: string } };
    };
  }
  const util: IUtil;
  export default util;
}
