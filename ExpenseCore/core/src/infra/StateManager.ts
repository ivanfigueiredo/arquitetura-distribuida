import { createClient, RedisClientType } from 'redis';
import { IStateManagerSetup, IStateManeger } from "./IStateManager";

export class StateManager implements IStateManeger, IStateManagerSetup {
    private client: RedisClientType;
    private traceId: string;

    constructor() {
        this.client = createClient({ url: 'redis://redis:6379' })
        this.traceId = ''
    }

    public async connect(): Promise<void> {
        await this.client.connect()
    }

    private getPrefixedKey(key: string): string {
        return `${this.traceId}:${key}`
    }

    public setTraceId(traceId: string): void {
        this.traceId = traceId
    }

    public async set<T>(key: string, data: T, expiresAt?: number): Promise<void> {
        const prefixedKey = this.getPrefixedKey(key)
        await this.client.set(prefixedKey, JSON.stringify(data), { EX: expiresAt ?? 15000, NX: true })
    }

    public async get<T>(key: string): Promise<T | null> {
        const prefixedKey = this.getPrefixedKey(key)
        const result = await this.client.get(prefixedKey)
        if (!result) return null
        return JSON.parse(result) as T
    }
}