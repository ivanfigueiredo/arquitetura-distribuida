import { RedisClientType } from 'redis';
import { IStateManagerSetup, IStateManeger } from "./IStateManager";

export class StateManager implements IStateManeger, IStateManagerSetup {
    private traceId: string;

    constructor(private readonly redisClient: RedisClientType) {
        this.traceId = ''
    }

    private getPrefixedKey(key: string): string {
        return `${this.traceId}:${key}`
    }

    public setTraceId(traceId: string): void {
        this.traceId = traceId
    }

    public async set<T>(key: string, data: T, expiresAt?: number): Promise<void> {
        const prefixedKey = this.getPrefixedKey(key)
        await this.redisClient.set(prefixedKey, JSON.stringify(data), { EX: expiresAt ?? 900.000, NX: true })
    }

    public async get<T>(key: string): Promise<T | null> {
        const prefixedKey = this.getPrefixedKey(key)
        const result = await this.redisClient.get(prefixedKey)
        if (!result) return null
        return JSON.parse(result) as T
    }
}