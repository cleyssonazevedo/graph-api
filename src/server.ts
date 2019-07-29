import gql from 'graphql-tag';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { UserResolver, UserResolverSchema } from './resolvers/user-resolver';
import { UserSchema } from './schema';

const PORT = process.env.PORT || 3000;

const server = new GraphQLServer({
    resolvers: [UserResolver],
    typeDefs: [
        gql`
            type Mutation { _: String }
            type Query { _: String }
            type Subscription { _: String }
        `,
        UserSchema,
        UserResolverSchema
    ],
    context: {
        pubsub: new PubSub()
    }
});

server.express.use(helmet({
    hidePoweredBy: true,
    ieNoOpen: true,
    noCache: true,
    noSniff: true
}));

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/graph-api')
    .then(() => console.log('Conectado ao MongoDB'))
    .catch((err) => console.error('Falha ao conectar no MongoDB', err));

server.start({
        cors: {
            allowedHeaders: 'Origin, Content-Type',
            methods: '*',
            origin: '*',
        },
        endpoint: '/api',
        playground: '/api/playground',
        subscriptions: '/subscriptions',
        port: PORT,
    })
    .then(() => console.log('Server started in port', PORT))
    .catch((err) => console.error('Falha ao iniciar a aplicação', err));
