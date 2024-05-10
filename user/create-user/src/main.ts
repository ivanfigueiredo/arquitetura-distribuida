import { UserService } from './application/UserService';
import { UserDatabase } from './infra/UserDatabase';
import { ExpressAdapter } from './infra/ExpressAdapter';
import { MainCoontroller } from './infra/MainController';
import { MongoDBAdapter } from './infra/MongoDBAdapter';
import QueueController from './infra/Queue/QueueController';
import { RabbitMQAdapter } from './infra/Queue/RabbitMQAdapter';
import { OpenTelemetrySDK } from './infra/OpenTelemetrySDK';
import { SpanAdapter } from './infra/SpanAdapter';

async function init() {
    new OpenTelemetrySDK();
    const spanAdapter = new SpanAdapter();
    const queue = new RabbitMQAdapter(spanAdapter);
    await queue.connect();
    const expressAdapter = new ExpressAdapter();
    const database = new MongoDBAdapter();
    const userDatabase = new UserDatabase(database);
    const service = new UserService(userDatabase, spanAdapter);
    new MainCoontroller(expressAdapter, service);
    new QueueController(queue, service);

    expressAdapter.listen(6001, () => {console.log('Rodando na porta 6001')});
}

init();