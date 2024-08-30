import { ExpenseCoreMain, IIdempotency, ILogger, ILoggerContext, IStateManeger, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { DocumentDatabase } from './infra/DocumentDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import QueueController from './infra/QueueController';
import { IIncludeDocument } from './application/IIncludeDocument';
import { IncludeDocument } from './application/IncludeDocument';
import { IExcludeDocument } from './application/IExcludeDocument';
import { ExcludeDocument } from './application/ExcludeDocument';

export class MainLayer {
    public expressAdapter?: ExpressAdapter
    public databaseConnection: DatabaseConnection
    public documentDatabase?: DocumentDatabase
    public includeDocument?: IIncludeDocument
    public excludeDocument?: IExcludeDocument
    public span?: SpanAdapter
    public rabbitMQAdapter?: RabbitMQAdapter
    public logger?: ILogger
    public loggerContext?: ILoggerContext
    public stateManager?: IStateManeger
    public idempotency?: IIdempotency

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init()
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!)
        this.documentDatabase = new DocumentDatabase(this.databaseConnection, this.logger!)
        this.includeDocument = new IncludeDocument(
            this.stateManager!,
            this.documentDatabase!,
            this.rabbitMQAdapter!,
            this.logger!,
            this.idempotency!
        )
        this.excludeDocument = new ExcludeDocument(
            this.stateManager!,
            this.documentDatabase!,
            this.logger!
        )
        new QueueController(this.rabbitMQAdapter!, this.logger!, this.includeDocument!, this.excludeDocument!)
        this.expressAdapter!.listen(9002, () => { console.log("Rodando na porta 9002") })
    }

}

const main = new MainLayer()
const core = new ExpenseCoreMain("Expense_Core", "client.include-document.queue");
(async () => {
    await core.initialize(main);
})()