import { EntityTarget } from "typeorm";
import { UserEntity } from "./entities/UserEntity";
import { VerificationCodeEntity } from "./entities/VerificationCodeEntity";

export interface IUnitOfWorkInfra {
  transaction<T>(data: T): Promise<void>;
  findOne(email: string, code: string): Promise<UserEntity | null>;
}
