import { PubSub } from 'graphql-subscriptions';
import { IPubSub } from './PubSub';

export class PubSubAdapter implements IPubSub {
    private pubSub: PubSub;

    constructor() {
        this.pubSub = new PubSub();
    }

    public subscribe<T>(channel: string): AsyncIterator<T> {
        return this.pubSub.asyncIterator([channel]);
    }

    public publish(channel: string, payload: object): void {
        this.pubSub.publish(channel, JSON.stringify(payload));
    }
}