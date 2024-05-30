import { ExpressAdapter } from "./infra/ExpressAdapter";
import QueueController from "./infra/Queue/QueueController";
import { RabbitMQAdapter } from "./infra/Queue/RabbitMQAdapter";


async function init() {
    const expressAdapter = new ExpressAdapter();
    const queue = new RabbitMQAdapter();
    await queue.connect();
    new QueueController(queue);
    expressAdapter.listen(7001, () => {console.log('Rodando na porta 7001')});
}

init();