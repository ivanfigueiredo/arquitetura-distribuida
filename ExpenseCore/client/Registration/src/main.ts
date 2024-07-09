import { ExpenseCoreMain, ILogger, ILoggerContext, IStateManeger, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { ClientRegistration } from './application/ClientRegistration';
import { ClientDatabase } from './infra/ClientDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { IClientRegistration } from './application/IClientRegistration';
import QueueController from './infra/QueueController';
import { ICreateClient } from './application/ICreateClient';
import { CreateClient } from './application/CreateClient';
import { IClientIncludeAddressError } from './application/IClientIncludeAddressError';
import { IClientIncludeDocumentError } from './application/IClientIncludeDocumentError';
import { ClientIncludeAddressError } from './application/ClientIncludeAddressError';
import { ClientIncludeDocumentError } from './application/ClientIncludeDocumentError';

export class MainLayer {
    public expressAdapter?: ExpressAdapter
    public databaseConnection: DatabaseConnection
    public unitOfWork?: UnitOfWork
    public clientDatabase?: ClientDatabase
    public clientRegistration?: IClientRegistration
    public clientIncludeAddressError?: IClientIncludeAddressError
    public clientIncludeDocumentError?: IClientIncludeDocumentError
    public createClient?: ICreateClient
    public span?: SpanAdapter
    public rabbitMQAdapter?: RabbitMQAdapter
    public logger?: ILogger
    public loggerContext?: ILoggerContext
    public stateManager?: IStateManeger

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init();
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!);
        this.unitOfWork = new UnitOfWork(this.databaseConnection);
        this.clientDatabase = new ClientDatabase(this.unitOfWork, this.logger!);
        this.clientRegistration = new ClientRegistration(
            this.logger!,
            this.stateManager!,
            this.rabbitMQAdapter!
        );
        this.createClient = new CreateClient(
            this.clientDatabase!,
            this.unitOfWork!,
            this.stateManager!,
            this.logger!,
            this.rabbitMQAdapter!
        )
        this.clientIncludeAddressError = new ClientIncludeAddressError(
            this.unitOfWork!,
            this.stateManager!,
            this.rabbitMQAdapter!,
            this.clientDatabase!,
            this.logger!
        )
        this.clientIncludeDocumentError = new ClientIncludeDocumentError(
            this.unitOfWork!,
            this.stateManager!,
            this.clientDatabase!,
            this.rabbitMQAdapter!,
            this.logger!
        )
        new QueueController(
            this.rabbitMQAdapter!,
            this.clientRegistration,
            this.logger!,
            this.createClient!,
            this.clientIncludeAddressError!,
            this.clientIncludeDocumentError!
        );
        this.expressAdapter!.listen(9001, () => { console.log("Rodando na porta 9001") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("Expense_Core", "client.registration.queue");
(async () => {
    await core.initialize(main);
})()