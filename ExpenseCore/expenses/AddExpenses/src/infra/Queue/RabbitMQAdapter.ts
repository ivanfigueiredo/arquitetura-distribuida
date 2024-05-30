import Queue from "./Queue";
import amqp from 'amqplib';

export class RabbitMQAdapter implements Queue {
    private connection: any;

    async connect(): Promise<void> {
        this.connection = await amqp.connect("amqp://rabbitmq:rabbitmq@localhost:5672");
    }

    async consume(queueName: string, callback: Function): Promise<void> {
        const channel = await this.connection.createChannel();
		await channel.assertQueue(queueName, { durable: true });
		channel.consume(queueName, async function (msg: any) {
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