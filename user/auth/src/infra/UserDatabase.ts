import { Repository } from "typeorm";
import { IUserRepository } from "../application/IUserRepository";
import { User } from "../domain/User";
import { UserEntity } from "./entities/UserEntity";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";
import { DatabaseConnection } from "./DatabaseConnection";
import { UnauthorizedException } from "./exceptions/UnauthorizedException";

export class UserDatabase implements IUserRepository {
    private readonly repository: Repository<UserEntity>;

    constructor(private readonly connection: DatabaseConnection) {
        this.repository = this.connection.getDataSourcer().getRepository(UserEntity);
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.repository.findOne({where: {email}});
            if (!user) throw new UnauthorizedException('Email or password invalid', 401);
            return User.restore(user.userId, user.email, user.password, user.userType);
        } catch (error) {
            console.log('ERROR -->>', error);
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }
}