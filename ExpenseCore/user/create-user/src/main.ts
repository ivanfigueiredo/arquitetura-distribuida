import { ExpenseCoreMain, SpanAdapter } from 'expense-core';
import { CreateUser } from './application/CreateUser';
import { UserDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';
import { DatabaseConnection } from './infra/DatabaseConnection';

export class MainLayer {
    public expressAdapter?: ExpressAdapter;
    public databaseConnection: DatabaseConnection;
    public unitOfWork?: UnitOfWork;
    public userDatabase?: UserDatabase;
    public createUser?: CreateUser;
    public span?: SpanAdapter;

    constructor() {
        this.databaseConnection = new PostgresAdapter();
    }

    async init(): Promise<void> {
        await this.databaseConnection!.init();
        this.expressAdapter = new ExpressAdapter(this.span!);
        this.unitOfWork = new UnitOfWork(this.databaseConnection);
        this.userDatabase = new UserDatabase(this.unitOfWork);
        this.createUser = new CreateUser(this.userDatabase, this.unitOfWork);
        new MainCoontroller(this.expressAdapter, this.createUser!);
        this.expressAdapter!.listen(6001, () => { console.log("Rodando na porta 6001") });
    }

}

const main = new MainLayer();
const core = new ExpenseCoreMain("create.user.service", "create.user");
(async () => {
    await core.initialize(main);
})()