import { ExpenseCoreMain, RabbitMQAdapter, SpanAdapter, } from 'expense-core';
import { Auth } from './application/Auth';
import { IAuth } from './application/IAuth';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainController } from './infra/MainController';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { UserDatabase } from './infra/UserDatabase';
import { IGenerateEmailConfirmationToken } from './application/IGenerateEmailConfirmationToken';
import { IAuthGateway } from './application/IAuthGateway';
import { AuthGateway } from './infra/AuthGateway';
import { GenerateEmailConfirmationToken } from './application/GenerateEmailConfirmationToken';

export class MainLayer {
    private expressAdapter?: ExpressAdapter;
    private databaseConnection: DatabaseConnection;
    private userDatabase?: UserDatabase;
    private auth?: IAuth;
    private generateEmailConfirmationToken?: IGenerateEmailConfirmationToken;
    private authGateway?: IAuthGateway;
    public span?: SpanAdapter;
    public rabbitMQAdapter?: RabbitMQAdapter;

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init();
        this.expressAdapter = new ExpressAdapter(this.span!);
        this.userDatabase = new UserDatabase(this.databaseConnection);
        this.auth = new Auth(this.userDatabase);
        this.authGateway = new AuthGateway(this.rabbitMQAdapter!, this.span!);
        this.generateEmailConfirmationToken = new GenerateEmailConfirmationToken(this.authGateway);
        new MainController(this.expressAdapter, this.auth!, this.generateEmailConfirmationToken!);
        this.expressAdapter!.listen(6000, () => { console.log("Rodando na porta 6000") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("auth.service", "user.auth");
(async () => {
    await core.initialize(main);
})()