import { UserEntity } from "./entities/UserEntity";

export interface IUnitOfWorkInfra {
  transaction(data: any): Promise<void>
  findOne(query: { [key: string]: { [key: string]: string } }): Promise<UserEntity | null>
}
