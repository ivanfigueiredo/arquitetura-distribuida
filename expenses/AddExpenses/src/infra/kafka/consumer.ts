import { KafkaConsumer } from "node-rdkafka";
import { Consumer, ConsumerGroup, KafkaClient,  } from 'kafka-node';

export class ConsumerKafka {
    private client: KafkaClient;
    private consumer: Consumer;
    private consumerGroup: ConsumerGroup;

    constructor() {
        this.client = new KafkaClient({kafkaHost: 'kafka:9092', })
        this.consumerGroup = new ConsumerGroup({
            groupId: 'TesteGroup',
            kafkaHost: 'kafka:9092',
            protocol: ['roundrobin'],
            outOfRangeOffset: 'earliest',
            id: '1'
        }, ['teste']);
        this.consumer = new Consumer(this.client, [{topic: 'teste', partition: 1}], {
            autoCommit: false,  
            groupId: 'TesteGroup',
        });
    }


    subscriber(): void {
        this.consumerGroup.on('connect', () => {
            console.log('===============>>>>>>')
        });
        this.consumer.on('error', (err) => {
            console.log('====================>>>>>>> ERROR', err);
        })
    }
}