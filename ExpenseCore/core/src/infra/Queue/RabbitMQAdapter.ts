import { ISpan } from "../ISpan";
import { Queue } from "./Queue";
import amqp from 'amqplib';

export class RabbitMQAdapter implements Queue {
	private connection: any;

	constructor(private readonly context: ISpan) { }

	async connect(): Promise<void> {
		this.connection = await amqp.connect("amqp://rabbitmq:rabbitmq@rabbitMQ:5672");
	}

	async consume(queueName: string, exchange: string, routeKey: string, callback: Function): Promise<void> {
		const channel = await this.connection.createChannel();
		await channel.bindQueue(queueName, exchange, routeKey);
		channel.consume(queueName, async (msg: any) => {
			this.context.setContext({
				correlationId: msg.properties.headers.correlationId,
				traceparent: msg.properties.headers.traceparent
			});
			const input = JSON.parse(msg.content.toString());
			try {
				await callback(input);
				channel.ack(msg);
			} catch (e: any) {
				console.log(e.message);
			}
		});
	}

	async publish(exchange: string, routeKey: string, data: any, headers: { [key: string]: string }): Promise<void> {
		const channel = await this.connection.createChannel();
		await channel.publish(exchange, routeKey, Buffer.from(JSON.stringify(data)), { headers })
	}
}