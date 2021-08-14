import { Util } from '~/libs/util';
//import { ProjectBuilder } from '~/libs/projectBuilder';

const util = new Util();
//const projectBuilder = new ProjectBuilder();

util.appBanner('test-one').then(() => console.log('finish'));
//projectBuilder.genMainConfigInterface().then((res) => console.log(res));
