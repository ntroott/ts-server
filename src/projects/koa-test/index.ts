import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('koa-test');
import { server } from '~l/koaServer';
import Router from 'koa-router';

const router = new Router();
router.get('/test', async (ctx) => {
  ctx.status = 200;
  ctx.response.body = 555;
});

server(router).then();
