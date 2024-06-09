export interface IUnitOfWorkApplication {
    startTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollBack(): Promise<void>;
    release(): Promise<void>;
}