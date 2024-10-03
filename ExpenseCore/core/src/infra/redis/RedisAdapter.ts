import { createClient, RedisClientType } from "redis";
import { IConnection } from "./IConnection";

export class RedisAdapter implements IConnection {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({            
            url: 'redis://redis:6379'
         })
    }

    public async connection(): Promise<void> {
        await this.client.connect()
    }

    public getRedisClient(): RedisClientType {
        return this.client
    }
}