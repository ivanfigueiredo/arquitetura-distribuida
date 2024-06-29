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

    async save(user: User): Promise<void> {
        try {
            await this.unitOfWork.transaction(UserEntity.from(user));
        } catch (error: any) {
            this.logger.error(`UserDatabase - [save] - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }
}