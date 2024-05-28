import { ExpenseCoreMain, SpanAdapter, } from 'expense-core';
import { Auth } from './application/Auth';
import { IAuth } from './application/IAuth';
import { DatabaseConnection } from './infra/DatabaseConnection';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainController } from './infra/MainController';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { UserDatabase } from './infra/UserDatabase';

export class MainLayer {
    public expressAdapter?: ExpressAdapter;
    public databaseConnection: DatabaseConnection;
    public userDatabase?: UserDatabase;
    public auth?: IAuth;
    public span?: SpanAdapter;

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection.init();
        this.expressAdapter = new ExpressAdapter(this.span!);
        this.userDatabase = new UserDatabase(this.databaseConnection);
        this.auth = new Auth(this.userDatabase);
        new MainController(this.expressAdapter, this.auth!);
        this.expressAdapter!.listen(6000, () => { console.log("Rodando na porta 6000") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("auth.service", "user.auth");
(async () => {
    await core.initialize(main);
})()