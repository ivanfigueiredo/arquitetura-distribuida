import { ClientEntity } from "./entities/ClientEntity";

export interface IUnitOfWorkInfra {
  transaction(client: ClientEntity): Promise<void>;
}
