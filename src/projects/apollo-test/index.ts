import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('apollo-test');
import { ApolloServer, gql } from 'apollo-server-koa';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import { app, listen } from '~l/koaServer';
import { Sequelize as Seq } from 'sequelize-typescript';
import { Sequelize, Op } from 'sequelize';
import { Author, Book } from './sequelize/models';
import { recursiveReplace } from '~l/util';

const seq = new Seq(RunTimeConfig.get().dbConfig);
seq.addModels([Author, Book]);

const typeDefs = gql`
  type Author {
    id: Int
    firstName: String
    lastName: String
    middleName: String
    birthDate: String
  }
  type Book {
    id: Int
    name: String
    publicationYear: Int
    author: Author
  }
  type Query {
    findBooks(queryString: String): [Book]
  }
`;
const resolvers = {
  Query: {
    findBooks: async (_parent, args) => {
      const queryString = recursiveReplace(args.queryString, '  ', '').toLowerCase();
      if (queryString.replace(' ', '').length < 3) {
        return [];
      }
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
      return Book.findAll({
        attributes: ['id', 'name', 'publicationYear'],
        include: {
          model: Author,
          required: true,
          attributes: ['id', 'firstName', 'lastName', 'middleName', 'birthDate'],
        },
        where,
      });
    },
  },
};
const startApolloServer = async (typeDefs, resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginInlineTrace()],
  });
  await server.start();
  const app1 = await app();
  server.applyMiddleware({ app: app1 });
  await listen(app1, server.graphqlPath);
  return { server, app: app1 };
};

startApolloServer(typeDefs, resolvers).then();
