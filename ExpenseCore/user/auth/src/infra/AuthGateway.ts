import axios from 'axios';
import { ISpan, Queue } from 'expense-core';
import { Data, IAuthGateway } from "../application/IAuthGateway";

export class AuthGateway implements IAuthGateway {
    constructor(
        private readonly queue: Queue,
        private readonly context: ISpan
    ) { }

    async createUserNotification(data: Data): Promise<void> {
        const url = 'http://maildispatcher:8081/notification-email-confirmation';
        const headers = this.context.getHeaders();
        try {
            await axios.post(url, data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'traceparent': headers.traceparent,
                        'correlationid': headers.correlationId
                    }
                }
            )
        } catch (error: any) {
            console.log('================>>>>>>> ERROR', error);
            const exchange = 'generate.email.confirmation.events';
            const routeKey = 'user.created';
            await this.queue.publish(exchange, routeKey, data, headers);
        }
    }
}