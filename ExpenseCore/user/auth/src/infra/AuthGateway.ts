import axios from 'axios';
import { ISpan, Queue } from 'expense-core';
import { Data, IAuthGateway } from "../application/IAuthGateway";

export class AuthGateway implements IAuthGateway {
    constructor(
        private readonly queue: Queue,
        private readonly context: ISpan
    ) { }

    async createUserNotification(data: Data): Promise<void> {
        const url = 'http://localhost:8081/notification-email-confirmation';
        try {
            await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } })
        } catch (error: any) {
            const headers = this.context.getHeaders();
            const exchange = 'generate.email.confirmation.events';
            const routeKey = 'user.created';
            await this.queue.publish(exchange, routeKey, data, headers);
        }
    }
}