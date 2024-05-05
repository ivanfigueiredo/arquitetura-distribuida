import { Usecase1 } from "./application/Usecase1";
import { Usecase2 } from "./application/Usecase2";
import { ExpressAdapter } from "./infra/ExpressAdapter";
import QueueController from "./infra/Queue/QueueController";
import { RabbitMQAdapter } from "./infra/Queue/RabbitMQAdapter";
import { ConsumerKafka } from './infra/kafka/consumer';


async function init() {
    const expressAdapter = new ExpressAdapter();
    const usecase1 = new Usecase1();
    const usecase2 = new Usecase2();

    //const queue = new RabbitMQAdapter();
    const Kafka = new ConsumerKafka()
    Kafka.subscriber();
  //  await queue.connect();
    // new QueueController(queue);
    expressAdapter.listen(7001, () => {console.log('Rodando na porta 7001')});
}

init();