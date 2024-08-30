import { RedisClientType } from "redis"

export interface IConnection {
    connection(): Promise<void>
    getRedisClient(): RedisClientType
}