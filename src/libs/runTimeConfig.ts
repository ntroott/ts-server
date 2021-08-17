export class RunTimeConfig {
  public static set(appName: string) {
    if (!process.env.WEBPACK_BUNDLE) {
      process.env.NODE_APP_INSTANCE = appName;
      process.env.NODE_ENV = process.env.NODE_ENV || 'development';
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      process.env.NODE_CONFIG = JSON.stringify(require('config').util.toObject());
    }
    const config = RunTimeConfig.get();
    console.log('appName = ' + process.env.NODE_APP_INSTANCE);
    console.log('env = ' + process.env.NODE_ENV);
    console.log('description = ' + config.description);
  }
  public static get(): import('~g/runTimeConfig').RunTimeConfig {
    return JSON.parse(process.env.NODE_CONFIG || '{}');
  }
}
