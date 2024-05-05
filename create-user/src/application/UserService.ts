import { User } from "../domain/User";
import { IUserRepository } from "./IUserRepository";
import { IUserService } from "./IUserService";
import { CreateUserDto } from "./dto/CreateUserDto";

export class UserService implements IUserService {
    constructor(private readonly repository: IUserRepository) {}

    async createUser(dto: CreateUserDto): Promise<any> {
        const user = User.create(dto.name, dto.email, dto.password, dto.birthdate);
        await this.repository.save(user);
    }
}