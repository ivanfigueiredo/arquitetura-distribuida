import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { createServer, Server } from 'http';
import { expressMiddleware } from '@apollo/server/express4';
import express, { Application } from 'express';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import { typeDefs } from './Types';
import { Resolver } from './Resolver';
import { IPubSub } from './PubSub';


export class ApolloServerAdapter {
    private pubsub: IPubSub;
    private httpServer: Server;
    private app: Application;

    constructor(pubSub: IPubSub) {
        this.pubsub = pubSub;
        this.app = express();
        this.httpServer = createServer(this.app);
    }

    public async connection() {
        const wsServer = new WebSocketServer({
            server: this.httpServer,
            path: '/graphql',
        });
        const schema = makeExecutableSchema({ typeDefs: typeDefs(), resolvers: new Resolver(this.pubsub) });
        const serverCleanup = useServer({ schema }, wsServer);
        const server = new ApolloServer({
            introspection: true,
            csrfPrevention: true,
            cache: 'bounded',
            schema,
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
                ApolloServerPluginLandingPageLocalDefault({ embed: true }),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose();
                            },
                        };
                    },
                },
            ]
        });
        await server.start();
        this.app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));
    }

    public listen() {
        const PORT = 3333;
        this.httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
    }
}

