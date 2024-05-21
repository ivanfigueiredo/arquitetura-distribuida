import { UserService } from './application/UserService';
import { AuthDatabase } from './infra/AuthDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { MongoDBAdapter } from './infra/MongoDBAdapter';
import { TraceContext } from './infra/TraceContext';

async function init() {
	
    const traceContext = new TraceContext();
    const expressAdapter = new ExpressAdapter(traceContext);
    const database = new MongoDBAdapter();
    const userDAO = new AuthDatabase(database, traceContext);
    const service = new UserService(userDAO);
    new MainCoontroller(expressAdapter, service);

    expressAdapter.listen(6000, () => {console.log('Rodando na porta 6000')});
}

init();