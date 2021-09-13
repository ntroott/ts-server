import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('koa-test');
import { server } from '~l/koaServer';
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
  queryString = recursiveReplace(queryString, '  ', '').toLowerCase();
  const arr = queryString.split(' ');
  const where = Sequelize.where(
    Sequelize.fn(
      'lower',
      Sequelize.fn('concat', Sequelize.col('firstName'), ' ', Sequelize.col('lastName'))
    ),
    {
      [Op.like]: {
        [Op.any]: [`%${queryString}%`, `%${arr[1] + ' ' + arr[0]}%`],
      },
    }
  );
  const authors = await Author.findAll({ where });
  let books;
  if (authors.length) {
    books = await Book.findAll({
      include: { model: Author, required: true },
      where: { authorId: { [Op.in]: authors.map((item) => item.id) } },
    });
  } else {
    books = await Book.findAll({
      include: { model: Author, required: true },
      where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('name')), {
        [Op.like]: `%${queryString}%`,
      }),
    });
  }
  ctx.response.body = books;
});

server(router).then();
