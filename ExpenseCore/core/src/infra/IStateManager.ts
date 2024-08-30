export interface IStateManeger {
    set<T>(key: string, data: T, expiresAt?: number): Promise<void>
    get<T>(key: string): Promise<T | null>
}

export interface IStateManagerSetup {
    setTraceId(traceId: string): void
}