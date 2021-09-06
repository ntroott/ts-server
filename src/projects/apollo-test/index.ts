import { RunTimeConfig } from '~l/runTimeConfig';
RunTimeConfig.set('apollo-test');
import { ApolloServer, gql } from 'apollo-server-koa';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import Koa from 'koa';

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }
  type Query {
    booksByAuthors(author: String): [Book]
    booksByTitles(title: String): [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];
const resolvers = {
  Query: {
    booksByAuthors: (_parent, args) => books.filter((item) => item.author === args.author),
    booksByTitles: (_parent, args) => books.filter((item) => item.title === args.title),
  },
};
const startApolloServer = async (typeDefs, resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginInlineTrace()],
  });
  await server.start();
  const app = new Koa();
  server.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port: 3000 }, resolve as () => void));
  console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
  return { server, app };
};

startApolloServer(typeDefs, resolvers).then();
