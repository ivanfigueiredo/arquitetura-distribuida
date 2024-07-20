import { ILogger } from "expense-core";
import { IUserRepository } from "../application/IUserRepository";
import { User } from "../domain/User";
import { UserEntity } from "./entities/UserEntity";
import { InternalServerErrorException } from "../application/exceptions/InternalServerErrorException";
import { Repository } from "typeorm";
import { DatabaseConnection } from "./DatabaseConnection";

export class UserDatabase implements IUserRepository {
    private readonly repository: Repository<UserEntity>

    constructor(
        private readonly connection: DatabaseConnection,
        private readonly logger: ILogger
    ) {
        this.repository = this.connection.getDataSourcer().getRepository(UserEntity)
    }

    public async save(user: User): Promise<void> {
        try {
            await this.repository.save(UserEntity.from(user))
        } catch (error: any) {
            this.logger.error(`UserDatabase - [save] - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }

    public async findUserByEmail(email: string): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { email } })
        if (user) return user.to()
    }

    public async findUserByUserId(userId: string): Promise<User | undefined> {
        const user = await this.repository.findOne({ where: { userId } })
        if (user) return user.to()
    }
}