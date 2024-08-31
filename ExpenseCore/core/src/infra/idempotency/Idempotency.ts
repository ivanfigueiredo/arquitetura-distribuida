import { RedisClientType } from "redis"
import { ConcurrencyException } from "../exceptions/ConcurrencyException"
import { IdempotencyStatus } from "./IdempotencyStatus"
import { IIdempotency } from "./IIdempotency"
import { createHash } from 'crypto'

export class Idempotency implements IIdempotency {
    private hash: string = ''

    constructor(private readonly redisClient: RedisClientType) {}
    
    public async saveIdempotency<T = any, D = Record<string, any>>(
        idempotencyKey: T,
        payload: D
    ): Promise<void> {
        const hash = this.generateHash(idempotencyKey)
        await this.redisClient.set(
            hash, 
            JSON.stringify({status: IdempotencyStatus.IN_PROGRESS, payload}),
            { EX: 900.000 }
        )
    }

    private setHash(hash: string): void {
        this.hash = hash
    }

    private generateHash(data: any): string {
        const hash = createHash('sha256').update(JSON.stringify(data)).digest('hex')
        return hash
    }
    
    public async checkIdempotency(data: any): Promise<void> {
        const hash = this.generateHash(data)
        this.setHash(hash)
        const result = await this.redisClient.get(hash)
        if (result) {
            const output = JSON.parse(result) as IdempotencyType<any>
            if (this.isConcurrentTransaction(output)) {
                throw new ConcurrencyException('Concurrent transaction.')
            }
        }
    }

    private isConcurrentTransaction(idempotencyType: IdempotencyType<any>): boolean {
        return idempotencyType.status == IdempotencyStatus.IN_PROGRESS
    }

    private isCompletedTransaction(idempotencyType: IdempotencyType<any>): boolean {
        return idempotencyType.status === IdempotencyStatus.COMPLETED
    }

    public async retrieveProcessedResult<D>(): Promise<D | null> {
        const data = await this.redisClient.get(this.hash)
        if (data) {
            const output = JSON.parse(data) as IdempotencyType<D>
            if (this.isCompletedTransaction(output)) {
                return output.payload
            }
        }
        return null
    }

    public async updateIdempotencyStatus(): Promise<void> {
        const result = await this.redisClient.get(this.hash)
        if (result) {
            const output = JSON.parse(result) as IdempotencyType<any>
            await this.redisClient.set(
                this.hash, 
                JSON.stringify({status: IdempotencyStatus.COMPLETED, payload: output.payload}),
                { EX: 900.000 }
            )
        }
    }
}

type IdempotencyType<T> = {
    status: IdempotencyStatus,
    payload: T
}