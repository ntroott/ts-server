export class Util {
  constructor() {
    process.env.NODE_CONFIG_STRICT_MODE = 'true';
  }
  public appBanner(appName: string): void {
    if (!process.env.BUNDLED) {
      process.env.NODE_APP_INSTANCE = appName;
    }
    const config = this.getMainConfig();
    console.log('appName = ' + process.env.NODE_APP_INSTANCE);
    console.log('env = ' + process.env.NODE_ENV);
    console.log('description = ' + config.description);
  }
  public getMainConfig(): { [key: string]: { [key: string]: string } } {
    if (!process.env.BUNDLED) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('config').util.toObject();
    } else {
      return JSON.parse(process.env.MAIN_CONFIG || '{}');
    }
  }
}
