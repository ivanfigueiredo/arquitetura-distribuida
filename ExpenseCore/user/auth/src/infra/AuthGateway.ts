import axios from 'axios';
import { ILogger, ISpan, Queue } from 'expense-core';
import { Data, IAuthGateway } from "../application/IAuthGateway";

export class AuthGateway implements IAuthGateway {
    constructor(
        private readonly queue: Queue,
        private readonly context: ISpan,
        private readonly logger: ILogger
    ) { }

    async createUserNotification(data: Data): Promise<void> {
        const url = 'http://maildispatcher:8081/notification-email-confirmation'
        try {
            this.context.startSpanWithContext("call.notification.email.sync")
            const headers = this.context.contextPropagationWith()
            await axios.post(url, data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceparent': headers.traceparent,
                        'correlationid': headers.correlationId
                    }
                }
            )
            this.context.endSpanWithContext()
        } catch (error: any) {
            this.logger.error(`AuthGateway - [createUserNotification] - Error: ${error.message}`)
            const exchange = 'generate.email.confirmation.events'
            const routeKey = 'user.created'
            this.context.startSpanWithContext("call.notification.email.sync")
            this.logger.info("AuthGateway - Fazendo chamada Assincrona")
            await this.queue.publish(exchange, routeKey, data)
            this.context.endSpanWithContext()
        }
    }
}