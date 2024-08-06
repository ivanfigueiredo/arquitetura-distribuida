
import { ClientCreated } from './application/ClientCreated';
import { ApolloServerAdapter } from './infra/ApolloServer';
import { PubSubAdapter } from './infra/PubSubAdapter';
import { ExpenseCoreMain, ILogger, ILoggerContext, IStateManeger, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import QueueController from './infra/QueueController';
import { IClientCreated } from './application/IClientCreated';
import { IClientCreatedError } from './application/IClientCreatedError';
import { ClientCreatedError } from './application/ClientCreatedError';
import { IAuthenticateGateway } from './application/IAuthenticateGateway';
import { AuthenticateGateway } from './infra/AuthenticateGateway';

export class MainLayer {
    public span?: SpanAdapter
    public rabbitMQAdapter?: RabbitMQAdapter
    public clientCreated?: IClientCreated
    public clientCreatedError?: IClientCreatedError
    public auhenticate?: IAuthenticateGateway
    public logger?: ILogger
    public loggerContext?: ILoggerContext
    public stateManager?: IStateManeger

    async init(): Promise<void> {
        const pubsubAdapter = new PubSubAdapter()
        this.auhenticate = new AuthenticateGateway()
        const apolloServer = new ApolloServerAdapter(pubsubAdapter, this.auhenticate!)
        this.clientCreated = new ClientCreated(pubsubAdapter)
        this.clientCreatedError = new ClientCreatedError(pubsubAdapter)
        new QueueController(
            this.rabbitMQAdapter!,
            this.logger!,
            this.clientCreated!,
            this.clientCreatedError!
        )
        await apolloServer.connection()
        apolloServer.listen()
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("BFF", "bff.service");
(async () => {
    await core.initialize(main);
})()