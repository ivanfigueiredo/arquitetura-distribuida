export interface IPubSub {
    subscribe<T>(channel: string): AsyncIterator<T>;
    publish(channel: string, payload: object): void;
}