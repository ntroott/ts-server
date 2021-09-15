import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('koa-test');
import { app, listen } from '~l/koaServer';
import Router from 'koa-router';
import { Sequelize as Seq } from 'sequelize-typescript';
import { Sequelize, Op } from 'sequelize';
import { Author, Book } from './sequelize/models';
import { recursiveReplace } from '~l/util';

const seq = new Seq(RunTimeConfig.get().dbConfig);
seq.addModels([Author, Book]);
const router = new Router();

router.get('/findBooks', async (ctx) => {
  ctx.status = 200;
  let { queryString } = ctx.query as { queryString: string };
  ctx.response.body = [];
  if (queryString.replace(' ', '').length < 3) {
    return;
  }
  queryString = recursiveReplace(queryString, '  ', '').toLowerCase();
  const arr = queryString.split(' ');
  const authors = await Author.findAll({
    where: Sequelize.where(
      Sequelize.fn(
        'lower',
        Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName'))
      ),
      {
        [Op.like]: {
          [Op.any]: [`%${queryString}%`, `%${arr[1] + ' ' + arr[0]}%`],
        },
      }
    ),
  });

  const where = authors.length
    ? { authorId: { [Op.in]: authors.map((item) => item.id) } }
    : Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
        [Op.like]: `%${queryString}%`,
      });
  ctx.response.body = await Book.findAll({
    attributes: ['id', 'name', 'publicationYear'],
    include: {
      model: Author,
      required: true,
      attributes: ['id', 'firstName', 'lastName', 'middleName', 'birthDate'],
    },
    where,
  });
});

app(router).then(async (app) => {
  return listen(app, RunTimeConfig.get().build.swagger.url);
});
