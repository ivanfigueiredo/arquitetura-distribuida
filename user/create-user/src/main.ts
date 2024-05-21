import { CreateUser } from './application/CreateUser';
import { UserDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import QueueController from './infra/Queue/QueueController';
import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { SpanAdapter } from './infra/SpanAdapter';
import { UnitOfWork } from './infra/UnitOfWork';
import { PostgresAdapter } from './infra/PostgresAdapter';

async function init() {
    new OpenTelemetrySDK();
    const spanAdapter = new SpanAdapter();
    const queue = new RabbitMQAdapter(spanAdapter);
    await queue.connect();
    const expressAdapter = new ExpressAdapter(spanAdapter);
    const database = new PostgresAdapter();
    await database.init();
    const unitOfWork = new UnitOfWork(database);
    const userDatabase = new UserDatabase(unitOfWork);
    const createUser = new CreateUser(userDatabase, unitOfWork, spanAdapter);
    new MainCoontroller(spanAdapter, expressAdapter, createUser);
    new QueueController(queue, createUser);

    expressAdapter.listen(6001, () => {console.log('Rodando na porta 6001')});
}

init();