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
import { IClientIncludedAddress } from './application/IClientIncludedAddress';
import { IClientIncludedDocument } from './application/IClientIncludedDocument';
import { ClientIncludedAddress } from './application/ClientIncludedAddress';
import { ClientIncludedDocument } from './application/ClientIncludedDocument';
import { IExcludeClient } from './application/IExcludeClient';
import { ExcludeClient } from './application/ExcludeClient';

export class MainLayer {
    public expressAdapter?: ExpressAdapter
    public databaseConnection: DatabaseConnection
    public unitOfWork?: UnitOfWork
    public clientDatabase?: ClientDatabase
    public clientRegistration?: IClientRegistration
    public clientIncludecAddress?: IClientIncludedAddress
    public clientIncludedDocument?: IClientIncludedDocument
    public excludeClient?: IExcludeClient
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
        this.unitOfWork = new UnitOfWork(this.databaseConnection, this.logger!);
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
        this.clientIncludecAddress = new ClientIncludedAddress(
            this.stateManager!,
            this.rabbitMQAdapter!,
            this.logger!
        )
        this.clientIncludedDocument = new ClientIncludedDocument(
            this.unitOfWork!,
            this.stateManager!,
            this.clientDatabase!,
            this.rabbitMQAdapter!,
            this.logger!
        )
        this.excludeClient = new ExcludeClient(
            this.clientDatabase!,
            this.unitOfWork!,
            this.stateManager!,
            this.logger!,
            this.rabbitMQAdapter!
        )
        new QueueController(
            this.rabbitMQAdapter!,
            this.clientRegistration,
            this.logger!,
            this.createClient!,
            this.clientIncludecAddress!,
            this.clientIncludedDocument!,
            this.excludeClient!
        )
        this.expressAdapter!.listen(9001, () => { console.log("Rodando na porta 9001") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("Expense_Core", "client.registration.queue");
(async () => {
    await core.initialize(main);
})()