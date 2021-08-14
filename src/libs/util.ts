export class Util {
  constructor() {
    process.env.NODE_CONFIG_STRICT_MODE = 'true';
  }

  public async appBanner(appName: string): Promise<void> {
    if (!process.env.BUNDLED) {
      process.env.NODE_APP_INSTANCE = appName;
    }
    const config = await this.getMainConfig();
    console.log('appName = ' + process.env.NODE_APP_INSTANCE);
    console.log('env = ' + process.env.NODE_ENV);
    console.log('description = ' + config.description);
  }

  public async getMainConfig(): Promise<import('~g/config').IResult> {
    if (!process.env.BUNDLED) {
      return (await import('config')).default.util.toObject();
    } else {
      return JSON.parse(process.env.MAIN_CONFIG || '{}');
    }
  }
}
