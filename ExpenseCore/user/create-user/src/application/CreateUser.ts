import { User } from "../domain/User";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IUserRepository } from "./IUserRepository";
import { ICreateUser, UserCreatedDto } from "./ICreateUser";
import { CreateUserDto } from "./dto/CreateUserDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { IGenerateCodeConfirmation } from "./IGenerateCodeConfirmationGateway";

export class CreateUser implements ICreateUser {
    constructor(
        private readonly repository: IUserRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly generateCodeConfirmation: IGenerateCodeConfirmation
    ) { }

    async execute(dto: CreateUserDto): Promise<UserCreatedDto> {
        try {
            await this.unitOfWork.startTransaction();
            const user = User.create(dto.email, dto.password, dto.userType);
            await this.repository.save(user);
            await this.unitOfWork.commit();
            await this.generateCodeConfirmation.generateCode(user.email);
            return { userId: user.userId };
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                console.log('Executando rollback')
                await this.unitOfWork.rollBack();
                throw error;
            }
            throw error;
        }
    }
}