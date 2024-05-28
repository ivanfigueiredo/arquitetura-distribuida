import { ExpenseCoreMain, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { ClientRegistration } from './application/ClientRegistration';
import { ClientDatabase } from './infra/ClientDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { IClientRegistration } from './application/IClientRegistration';
import QueueController from './infra/QueueController';

export class MainLayer {
    public expressAdapter?: ExpressAdapter;
    public databaseConnection: DatabaseConnection;
    public unitOfWork?: UnitOfWork;
    public clientDatabase?: ClientDatabase;
    public clientRegistration?: IClientRegistration;
    public span?: SpanAdapter;
    public rabbitMQAdapter?: RabbitMQAdapter

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init();
        this.expressAdapter = new ExpressAdapter(this.span!);
        this.unitOfWork = new UnitOfWork(this.databaseConnection);
        this.clientDatabase = new ClientDatabase(this.unitOfWork);
        this.clientRegistration = new ClientRegistration(this.clientDatabase, this.unitOfWork);
        new QueueController(this.rabbitMQAdapter!, this.clientRegistration);
        this.expressAdapter!.listen(9001, () => { console.log("Rodando na porta 9001") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("client.registration.service", "client.registration.queue");
(async () => {
    await core.initialize(main);
})()