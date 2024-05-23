import { ISpan } from "../ISpan";
import Queue from "./Queue";
import amqp from 'amqplib';

export class RabbitMQAdapter implements Queue {
    private connection: any;

	constructor(private readonly context: ISpan) {}

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://rabbitmq:rabbitmq@rabbitMQ:5672");
    }

    async consume(queueName: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		channel.consume(queueName, async (msg: any)=> {
			// this.context.setHeaders({
			// 	correlationId: msg.properties.headers.correlationId,
			// 	traceparent: msg.properties.headers.traceparent
			// });
			const input = JSON.parse(msg.content.toString());
			try {
				await callback(input);
				channel.ack(msg);
			} catch (e: any) {
				console.log(e.message);
			}
		});
    }

    async publish(queueName: string, data: any): Promise<void> {
        const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
    }
}