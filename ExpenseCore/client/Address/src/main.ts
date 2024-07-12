import { ExpenseCoreMain, ILogger, ILoggerContext, IStateManeger, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { AddressDatabase } from './infra/AddressDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import QueueController from './infra/QueueController';
import { IIncludeAddress } from './application/IIncludeAddress';
import { IncludeAddress } from './application/IncludeAddress';

export class MainLayer {
    public expressAdapter?: ExpressAdapter
    public databaseConnection: DatabaseConnection
    public addressDatabase?: AddressDatabase
    public includeAddress?: IIncludeAddress
    public span?: SpanAdapter
    public rabbitMQAdapter?: RabbitMQAdapter
    public logger?: ILogger
    public loggerContext?: ILoggerContext
    public stateManager?: IStateManeger

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init()
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!)
        this.addressDatabase = new AddressDatabase(this.databaseConnection, this.logger!)
        this.includeAddress = new IncludeAddress(
            this.addressDatabase!,
            this.logger!,
            this.rabbitMQAdapter!
        )
        new QueueController(this.rabbitMQAdapter!, this.logger!, this.includeAddress!)
        this.expressAdapter!.listen(9003, () => { console.log("Rodando na porta 9003") })
    }

}

const main = new MainLayer()
const core = new ExpenseCoreMain("Expense_Core", "client.include-address.queue");
(async () => {
    await core.initialize(main);
})()