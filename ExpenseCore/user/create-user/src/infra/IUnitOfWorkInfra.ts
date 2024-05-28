export interface IUnitOfWorkInfra {
  transaction(data: any): Promise<void>;
}
