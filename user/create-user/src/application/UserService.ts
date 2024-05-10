import { User } from "../domain/User";
import { IApplicationSpan } from "./IApplicationSpan";
import { IUserRepository } from "./IUserRepository";
import { IUserService } from "./IUserService";
import { CreateUserDto } from "./dto/CreateUserDto";

export class UserService implements IUserService {
    constructor(
        private readonly repository: IUserRepository,
        private readonly span: IApplicationSpan
    ) {}

    async createUser(dto: CreateUserDto): Promise<any> {
        const user = User.create(dto.name, dto.email, dto.password, dto.birthdate);
        await this.span.startSpan("application.create.user", async () => await this.repository.save(user));
    }
}