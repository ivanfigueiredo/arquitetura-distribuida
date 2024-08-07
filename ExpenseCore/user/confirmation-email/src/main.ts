import { ExpenseCoreMain, ILogger, ILoggerContext, SpanAdapter } from 'expense-core';
import { UserDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { ConfirmationEmail } from './application/ConfirmationEmail';

export class MainLayer {
    private expressAdapter?: ExpressAdapter;
    private databaseConnection: DatabaseConnection;
    private unitOfWork?: UnitOfWork;
    private userDatabase?: UserDatabase;
    private confirmationEmail?: ConfirmationEmail;
    public span?: SpanAdapter;
    public logger?: ILogger;
    public loggerContext?: ILoggerContext;


    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection!.init();
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!);
        this.unitOfWork = new UnitOfWork(this.databaseConnection);
        this.userDatabase = new UserDatabase(this.unitOfWork, this.logger!);
        this.confirmationEmail = new ConfirmationEmail(this.userDatabase!, this.unitOfWork!, this.logger!);
        new MainCoontroller(this.expressAdapter, this.confirmationEmail!);
        this.expressAdapter!.listen(6002, () => { console.log("Rodando na porta 6002") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("Expense_Core", "command.confirmation.email");
(async () => {
    await core.initialize(main);
})()