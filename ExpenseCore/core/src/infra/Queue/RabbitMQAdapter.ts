import amqp from 'amqplib'
import retry from 'async-retry'
import { ILoggerContext } from "../ILoggerContext"
import { ISpan } from "../ISpan"
import { IStateManagerSetup } from "../IStateManager"
import { Queue } from "./Queue"
import { RetryEnum } from './RetryEnum'

export class RabbitMQAdapter implements Queue {
	private connection: any

	constructor(
		private readonly context: ISpan,
		private readonly loggerContext: ILoggerContext,
		private readonly stateManagerSetup: IStateManagerSetup
	) { }

	async connect(): Promise<void> {
		this.connection = await amqp.connect("amqp://rabbitmq:rabbitmq@rabbitMQ:5672")
	}

	async consume(queueName: string, exchange: string, routeKey: string, callback: Function): Promise<void> {
		const channel = await this.connection.createChannel()
		await channel.bindQueue(queueName, exchange, routeKey)
		channel.consume(queueName, async (msg: any) => {
			const traceparent = msg.properties.headers.traceparent
			this.context.setContext({ traceparent })
			const traceId = traceparent.split('-')[1]
			this.stateManagerSetup.setTraceId(traceId)
			const input = JSON.parse(msg.content.toString())
			try {
				await retry(async () => {
					this.context.startSpanWithoutContext(queueName)
					this.loggerContext.setContext(this.context.getSpanServer())
					try {
						await callback(input)
						channel.ack(msg)
						this.context.endSpanWithoutContext()
					} catch (error: any) {
						this.context.endSpanWithoutContext()
						throw error
					}
				}, {
					retries: RetryEnum.RETRIES,
					factor: RetryEnum.FACTOR,
					minTimeout: RetryEnum.MIN_TIMEOUT,
					maxRetryTime: RetryEnum.MAX_TIMEOUT,
					onRetry: (error: any, _) => {
						console.log(`Error: ${error.message}`)
					}
				})
			} catch (e: any) {
				channel.nack(msg, false, false)
			}
		});
	}

	async publish(exchange: string, routeKey: string, data: any): Promise<void> {
		const channel = await this.connection.createChannel()
		const spanName = "call." + routeKey
		this.context.startSpanWithContext(spanName)
		await channel.publish(exchange, routeKey, Buffer.from(JSON.stringify(data)), { headers: this.context.contextPropagationWith() })
		this.context.endSpanWithContext()
	}
}