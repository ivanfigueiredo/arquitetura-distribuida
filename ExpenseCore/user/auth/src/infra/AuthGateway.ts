import axios from 'axios';
import { ISpan, Queue } from 'expense-core';
import { Data, IAuthGateway } from "../application/IAuthGateway";

export class AuthGateway implements IAuthGateway {
    constructor(
        private readonly queue: Queue,
        private readonly context: ISpan
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
            const exchange = 'generate.email.confirmation.events'
            const routeKey = 'user.created'
            this.context.startSpanWithContext("call.notification.email.sync")
            const headers = this.context.contextPropagationWith()
            await this.queue.publish(exchange, routeKey, data, headers)
            this.context.endSpanWithContext()
        }
    }
}