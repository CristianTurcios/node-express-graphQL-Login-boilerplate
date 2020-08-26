import 'reflect-metadata';
import { resolve } from 'path';
import { GraphQLServer } from 'graphql-yoga';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import resolvers from './resolvers';
import './helpers/mongoConnection';
import router from './routes';

import { verifyTokenGraphql } from './middleware/authorize';

const createConnection = async () => {
  const options = {
    bodyParserOptions: { limit: '10mb', type: 'application/json' },
    debug: process.env.DEBUG === 'true',
    playground: '/playground',
    endpoint: '/graphql',
    port: process.env.PORT,
    tracing: false,
  };

  const server = new GraphQLServer({
    typeDefs: resolve(__dirname, 'schemas/schemas.graphql'),
    resolvers: resolvers as any,
    context: (req) => ({ req }),
    middlewares: [async (resolver, root, args, context, info) => {
      const tokenInfo = await verifyTokenGraphql(context.req.request);
      const newArgs = { ...args, token: tokenInfo };

      if (tokenInfo) {
        const result = await resolver(root, newArgs, context, info);
        return result;
      }
      throw new Error('UNAUTHORIZED');
    }],
  });

  const { express } = server;
  express.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  express.use(cors());
  express.use(bodyParser.json());
  express.use(bodyParser.urlencoded({ extended: false }));
  express.use(cookieParser());

  express.use(router);

  server.start(options, ({ port }) => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port: ${port}`);
  });
};
createConnection();
