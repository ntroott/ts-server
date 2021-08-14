import yaml from 'js-yaml';
import fs from 'fs-extra';
import appRoot from 'app-root-path';
import path from 'path';
import deepExtend from 'deep-extend';
import interfaceDefinition from 'json-to-ts-interface';

export class ProjectBuilder {
  public async genMainConfigInterface() {
    const confDir = appRoot.resolve('config');
    const files = await fs.readdir(confDir);
    const obj = {};
    for (let i = 0; i < files.length - 1; i++) {
      deepExtend(obj, yaml.load(await fs.readFile(path.posix.join(confDir, files[i]), 'utf8')));
    }
    const genDir = appRoot.resolve('src/generated');
    await fs.mkdirp(genDir);
    let res = ('export ' + interfaceDefinition(obj)) as string;
    res = res.replace(/interface;/gm, 'interface');

    await fs.writeFile(path.posix.join(genDir, 'config.d.ts'), res);
  }
}
