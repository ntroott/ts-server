export class RunTimeConfig {
  public static async appBanner(appName: string): Promise<void> {
    if (!process.env.WEBPACK_BUNDLE) {
      process.env.NODE_APP_INSTANCE = appName;
    }
    const config = await this.getMainConfig();
    console.log('appName = ' + process.env.NODE_APP_INSTANCE);
    console.log('env = ' + process.env.NODE_ENV);
    console.log('description = ' + config.description);
  }
  public static async getMainConfig(): Promise<import('~g/runTimeConfig').RunTimeConfig> {
    if (!process.env.WEBPACK_BUNDLE) {
      return (await import('config')).default.util.toObject();
    } else {
      return JSON.parse(process.env.NODE_CONFIG || '{}');
    }
  }
}
