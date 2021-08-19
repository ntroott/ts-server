import Koa from 'koa';
import koaBody from 'koa-body';
import Router from 'koa-router';
import logger from 'koa-logger';
import Boom from 'boom';
import * as util from './util';

export const server = async (router: Router) => {
  const app = new Koa();
  await util.setSwaggerConfig(app);
  app.use(koaBody({ jsonLimit: 1e8 }));
  app.use(logger());
  app.use(util.addPingToRouter(router).routes());
  app.use(util.errorHandler);
  app.use(
    router.allowedMethods({
      throw: true,
      notImplemented: () => Boom.notImplemented(),
      methodNotAllowed: () => Boom.methodNotAllowed(),
    })
  );
  app.listen(3000, () => console.log('listening on port 3000'));
  return app;
};
