import { ClientEntity } from './entities/ClientEntity';
import { EntityTarget, ObjectLiteral } from "typeorm";

export interface IUnitOfWorkInfra {
  transaction<T>(client: T): Promise<void>;
  findOne(clientId: string): Promise<ClientEntity | null>
  delete<T extends ObjectLiteral>(entityTarget: EntityTarget<T>, criteria: { [key: string]: string }): Promise<void>
}
