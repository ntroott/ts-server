import * as swagger from 'swagger2';
import deepExtend from 'deep-extend';
import Router from 'koa-router';
import Koa from 'koa';
import { RunTimeConfig } from '~l/runTimeConfig';
import { validate, ui } from 'swagger2-koa';
import appRoot from 'app-root-path';
import yaml from 'js-yaml';
import fs from 'fs-extra';

export const addPingToSwagger = (doc: swagger.Document): swagger.Document => {
  deepExtend(doc.paths, {
    '/ping': {
      get: {
        description: 'ping',
        responses: {
          200: {
            description: 'pong',
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  });
  return doc;
};

export const addPingToRouter = (router: Router): Router => {
  return router.get('/ping', (ctx) => {
    ctx.response.body = 'pong';
    ctx.status = 200;
  });
};

export const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

export const setSwaggerConfig = async (app: Koa): Promise<Koa> => {
  const swgConf = RunTimeConfig.get().build.swagger;
  if (swgConf) {
    let doc: swagger.Document;
    if (process.env.WEBPACK_BUNDLE) {
      doc = JSON.parse(process.env.SWAGGER_CONFIG);
    } else {
      doc = yaml.load(await fs.readFile(appRoot.resolve(swgConf), 'utf-8')) as swagger.Document;
    }
    if (!swagger.validateDocument(doc)) {
      throw Error(`does not conform to the Swagger 2.0 schema`);
    }
    doc = addPingToSwagger(doc);
    if (process.env.NODE_APP_INSTANCE !== 'production') {
      app.use(ui(doc, '/swagger'));
    }
    app.use(validate(doc));
  }
  return app;
};
