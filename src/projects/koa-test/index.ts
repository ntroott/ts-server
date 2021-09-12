import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('koa-test');
import { server } from '~l/koaServer';
import Router from 'koa-router';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { Author, Book } from './sequelize/models';

const seq = new Sequelize(RunTimeConfig.get().dbConfig);
seq.addModels([Author, Book]);

Book.findAll({
  include: [Author],
  where: {
    author: {
      [Op.or]: [
        {
          firstName: 'Пушкин',
        },
        {
          lastName: 'Пушкин',
        },
        {
          middleName: 'Пушкин',
        },
      ],
    },
  },
}).then((res) => console.log(res));
const router = new Router();
router.get('/test', async (ctx) => {
  ctx.status = 200;
  ctx.response.body = 'test';
});

server(router).then();
