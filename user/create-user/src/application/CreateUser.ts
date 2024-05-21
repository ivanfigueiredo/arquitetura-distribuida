import { User } from "../domain/User";
import { IApplicationSpan } from "./IApplicationSpan";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IUserRepository } from "./IUserRepository";
import { ICreateUser, UserCreatedDto } from "./ICreateUser";
import { CreateUserDto } from "./dto/CreateUserDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";

export class CreateUser implements ICreateUser {
    constructor(
        private readonly repository: IUserRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly span: IApplicationSpan
    ) {}

    async execute(dto: CreateUserDto): Promise<UserCreatedDto> {
        try {
            await this.unitOfWork.startTransaction();   
            const user = User.create(dto.email, dto.password, dto.userType);
            await this.span.startSpan("application.create.user", async () => await this.repository.save(user));
            await this.unitOfWork.commit();
            return { userId: user.userId };
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                console.log('Executando rollback')
                await this.span.startSpan('rollback.application.create.user', async () => await this.unitOfWork.rollBack());
                throw error;
            }
            throw error;
        }
    }
}