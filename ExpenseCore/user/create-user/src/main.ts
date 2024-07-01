import { ExpenseCoreMain, ILogger, ILoggerContext, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { CreateUser } from './application/CreateUser';
import { UserDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { GenerateCodeConfirmationGateway } from './infra/GenerateCodeConfirmationGateway';
import QueueController from './infra/QueueController';
import { UserInfo } from './application/UserInfo';
import { ICreateUser } from './application/ICreateUser';

export class MainLayer {
    private expressAdapter?: ExpressAdapter
    private databaseConnection: DatabaseConnection
    private unitOfWork?: UnitOfWork
    private userDatabase?: UserDatabase
    private generateCodeConfirmationGateway?: GenerateCodeConfirmationGateway
    public createUser?: ICreateUser
    public span?: SpanAdapter
    public logger?: ILogger
    public loggerContext?: ILoggerContext
    public rabbitMQAdapter?: RabbitMQAdapter


    constructor() {
        this.databaseConnection = new PostgresAdapter()
    }

    async init(): Promise<void> {
        await this.databaseConnection!.init()
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!)
        this.unitOfWork = new UnitOfWork(this.databaseConnection)
        this.userDatabase = new UserDatabase(this.unitOfWork, this.logger!)
        this.generateCodeConfirmationGateway = new GenerateCodeConfirmationGateway(this.span!)
        this.createUser = new CreateUser(
            this.userDatabase,
            this.unitOfWork,
            this.generateCodeConfirmationGateway!,
            this.logger!
        )
        const userInfo = new UserInfo(this.userDatabase!, this.rabbitMQAdapter!, this.logger!)
        new MainCoontroller(this.expressAdapter, this.createUser!)
        new QueueController(this.rabbitMQAdapter!, this.logger!, userInfo)
        this.expressAdapter!.listen(6001, () => { console.log("Rodando na porta 6001") })
    }

}

const main = new MainLayer()
const core = new ExpenseCoreMain("Expense_Core", "command.create.user");
(async () => {
    await core.initialize(main)
})()