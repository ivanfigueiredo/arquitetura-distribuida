import { ILogger } from "expense-core";
import { User } from "../domain/User";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IUserRepository } from "./IUserRepository";
import { ICreateUser, UserCreatedDto } from "./ICreateUser";
import { CreateUserDto } from "./dto/CreateUserDto";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";
import { IGenerateCodeConfirmation } from "./IGenerateCodeConfirmationGateway";

export class CreateUser implements ICreateUser {
    constructor(
        private readonly repository: IUserRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly generateCodeConfirmation: IGenerateCodeConfirmation,
        private readonly logger: ILogger
    ) { }

    async execute(dto: CreateUserDto): Promise<UserCreatedDto> {
        try {
            this.logger.info("CreateUser - Executando servico para criacao do usuario");
            await this.unitOfWork.startTransaction();
            this.logger.info("CreateUser - Criando usuario")
            const user = User.create(dto.email, dto.password, dto.userType);
            await this.repository.save(user);
            this.logger.info("CreateUser - Salvando usuario")
            await this.unitOfWork.commit();
            this.logger.info("CreateUser - Chamando servico para geracao de codigo para confirmacao de E-mail")
            await this.generateCodeConfirmation.generateCode(user.email);
            return { userId: user.userId };
        } catch (error: any) {
            this.logger.error(`CreateUser - ${error.message}`);
            if (error instanceof InternalServerErrorException) {
                this.logger.error("CreateUser - Executando rollback")
                await this.unitOfWork.rollBack();
                throw error;
            }
            throw error;
        }
    }
}