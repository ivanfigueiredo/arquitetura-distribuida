import { ILogger } from "expense-core";
import { IUserRepository } from "../application/IUserRepository";
import { User } from "../domain/User";
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra';
import { UserEntity } from "./entities/UserEntity";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";

export class UserDatabase implements IUserRepository {
    constructor(
        private readonly unitOfWork: IUnitOfWorkInfra,
        private readonly logger: ILogger
    ) { }

    async finUserByEmailAndCode(email: string, code: string): Promise<User | null> {
        try {
            const userEntity = await this.unitOfWork.findOne(email, code)
            if (!userEntity) return null
            return userEntity.toDomain();
        } catch (error: any) {
            this.logger.error(`UserDatabase - [finUserByEmailAndCode] - Error: ${error.message}`);
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }

    async save(user: User): Promise<void> {
        try {
            await this.unitOfWork.transaction<UserEntity>(UserEntity.from(user));
        } catch (error: any) {
            this.logger.error(`UserDatabase - [save] - Error: ${error.message}`);
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }
}