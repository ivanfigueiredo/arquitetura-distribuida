export interface IStateManeger {
    set<T>(key: string, data: T, expiresAt?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
}

export interface IStateManagerSetup {
    connect(): Promise<void>;
    setTraceId(traceId: string): void;
}