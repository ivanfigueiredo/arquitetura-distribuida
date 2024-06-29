import { ExpenseCoreMain, ILogger, ILoggerContext, RabbitMQAdapter, SpanAdapter } from 'expense-core';
import { Auth } from './application/Auth';
import { IAuth } from './application/IAuth';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainController } from './infra/MainController';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { UserDatabase } from './infra/UserDatabase';
import { IGenerateEmailConfirmationCode } from './application/IGenerateEmailConfirmationCode';
import { IAuthGateway } from './application/IAuthGateway';
import { AuthGateway } from './infra/AuthGateway';
import { GenerateEmailConfirmationCode } from './application/GenerateEmailConfirmationCode';
import { CodeDatabase } from './infra/CodeDatabase';

export class MainLayer {
    private expressAdapter?: ExpressAdapter;
    private databaseConnection: DatabaseConnection;
    private userDatabase?: UserDatabase;
    private codeDatabase?: CodeDatabase;
    private auth?: IAuth;
    private generateEmailConfirmationCode?: IGenerateEmailConfirmationCode;
    private authGateway?: IAuthGateway;
    public span?: SpanAdapter;
    public rabbitMQAdapter?: RabbitMQAdapter;
    public logger?: ILogger;
    public loggerContext?: ILoggerContext;

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init();
        this.expressAdapter = new ExpressAdapter(this.span!, this.loggerContext!);
        this.userDatabase = new UserDatabase(this.databaseConnection);
        this.codeDatabase = new CodeDatabase(this.databaseConnection, this.logger!)
        this.auth = new Auth(this.userDatabase, this.logger!);
        this.authGateway = new AuthGateway(this.rabbitMQAdapter!, this.span!, this.logger!);
        this.generateEmailConfirmationCode = new GenerateEmailConfirmationCode(this.codeDatabase, this.authGateway, this.logger!);
        new MainController(this.expressAdapter, this.auth!, this.generateEmailConfirmationCode!);
        this.expressAdapter!.listen(6000, () => { console.log("Rodando na porta 6000") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("Expense_Core", "command.user.auth");
(async () => {
    await core.initialize(main);
})()