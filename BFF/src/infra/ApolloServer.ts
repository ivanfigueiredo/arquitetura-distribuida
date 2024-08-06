import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default'
import { createServer, Server } from 'http'
import { expressMiddleware } from '@apollo/server/express4'
import express, { Application } from 'express'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import { makeExecutableSchema } from '@graphql-tools/schema'
import cors from 'cors'
import { typeDefs } from './Types'
import { Resolver } from './Resolver'
import { IPubSub } from './PubSub'
import { Context } from 'graphql-ws'
import { IAuthenticateGateway } from '../application/IAuthenticateGateway'
import { GraphQLError } from 'graphql'


export class ApolloServerAdapter {
    private httpServer: Server
    private app: Application

    constructor(
        private readonly pubsub: IPubSub,
        private readonly authenticate: IAuthenticateGateway
    ) {
        this.app = express()
        this.httpServer = createServer(this.app)
    }

    public async connection() {
        const wsServer = new WebSocketServer({
            server: this.httpServer,
            path: '/graphql',
        })
        const schema = makeExecutableSchema({ typeDefs: typeDefs(), resolvers: new Resolver(this.pubsub) })
        const serverCleanup = useServer(
            { 
                schema,
                onConnect: async (ctx: Context) => {
                    if (!ctx.connectionParams!.Authorization && !ctx.connectionParams!.authorization) {
                        throw new GraphQLError('User is not authenticated', {
                            extensions: {
                              code: 'UNAUTHENTICATED',
                              http: { status: 401 },
                            },
                        })
                    }
                    try {
                        const value = (ctx.connectionParams!.Authorization ?? ctx.connectionParams!.authorization) as string
                        const token = value!.split(' ')[1]
                        await this.authenticate.validate(token)
                    } catch (error: any) {
                        if (error.response.status === 401) {
                            throw new GraphQLError('User is not authenticated', {
                                extensions: {
                                  code: 'UNAUTHENTICATED',
                                  http: { status: 401 },
                                },
                            })
                        }
                        throw new GraphQLError('Internal Server Error', {
                            extensions: {
                              code: 'SERVER_ERROR',
                              http: { status: 500 },
                            },
                        })
                    }
                },
                onDisconnect: async (ctx: Context) => {
                    console.log('========>>> DISCONNECT ', ctx)
                },
                context: async (ctx: Context) => {
                    if (ctx.connectionParams!.Authorization || ctx.connectionParams!.authorization) {
                        const value = (ctx.connectionParams!.Authorization ?? ctx.connectionParams!.authorization) as string
                        const token = value!.split(' ')[1]
                        const output = await this.authenticate.validate(token)
                        return {userId: output}
                    }
                }
            }, 
            wsServer
        )
        const server = new ApolloServer({
            introspection: true,
            csrfPrevention: true,
            cache: 'bounded',
            typeDefs: typeDefs(),
            resolvers:  new Resolver(this.pubsub),
            plugins: [
                ApolloServerPluginDrainHttpServer({ httpServer: this.httpServer }),
                ApolloServerPluginLandingPageLocalDefault({ embed: true }),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                await serverCleanup.dispose()
                            },
                        }
                    },
                },
            ]
        })
        await server.start()
        this.app.use(
            '/',
            cors<cors.CorsRequest>(),
            express.json(),
            expressMiddleware(server, {
                context: async ({req}) => {
                    if (!req.headers.authorization) {
                        throw new GraphQLError('User is not authenticated', {
                            extensions: {
                              code: 'UNAUTHENTICATED',
                              http: { status: 401 },
                            },
                        })
                    }
                    try {
                        const token = req.headers.authorization!.split(' ')[1]
                        const output = await this.authenticate.validate(token)
                        return {userId: output}
                    } catch (error: any) {
                        if (error.response.status === 401) {
                            throw new GraphQLError('User is not authenticated', {
                                extensions: {
                                  code: 'UNAUTHENTICATED',
                                  http: { status: 401 },
                                },
                            })
                        }
                        throw new GraphQLError('Internal Server Error', {
                            extensions: {
                              code: 'SERVER_ERROR',
                              http: { status: 500 },
                            },
                        })
                    }
                }
            }))   
    }

    public listen() {
        const PORT = 3333
        this.httpServer.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`))
    }
}

