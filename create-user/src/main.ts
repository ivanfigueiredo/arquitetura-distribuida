import { UserService } from './application/UserService';
import { AuthDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { MongoDBAdapter } from './infra/MongoDBAdapter';
import QueueController from './infra/Queue/QueueController';
import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';

async function init() {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    const expressAdapter = new ExpressAdapter();
    const database = new MongoDBAdapter();
    const userDAO = new AuthDatabase(database);
    const service = new UserService(userDAO);
    new MainCoontroller(expressAdapter, service);
    new QueueController(queue, service);

    expressAdapter.listen(6001, () => {console.log('Rodando na porta 6001')});
}

init();