export interface IIdempotency {
    saveIdempotency<T = any, D = Record<string, any>>(idempotencyKey: T, payload: D): Promise<void>
    checkIdempotency(data: any): Promise<void>
    retrieveProcessedResult<D>(): Promise<D | null>
    updateIdempotencyStatus(): Promise<void>
}