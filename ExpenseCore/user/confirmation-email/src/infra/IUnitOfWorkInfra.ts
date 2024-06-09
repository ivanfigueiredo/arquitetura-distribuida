import { UserEntity } from "./entities/UserEntity";

export interface IUnitOfWorkInfra {
  transaction<T>(data: T): Promise<void>;
  findOne(email: string, code: string): Promise<UserEntity | null>;
}
