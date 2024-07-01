export interface IStateManeger {
    set<T>(key: string, data: T, expiresAt?: number): Promise<void>;
    get<T>(key: string): Promise<T>;
}

export interface IStateManagerSetup {
    connect(): Promise<void>;
    setTraceId(traceId: string): void;
}