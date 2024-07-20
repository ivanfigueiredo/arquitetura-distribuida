import { ILogger } from "expense-core";
import { User } from "../domain/User";
import { IUserRepository } from "./IUserRepository";
import { ICreateUser, UserCreatedDto } from "./ICreateUser";
import { CreateUserDto } from "./dto/CreateUserDto";
import { IGenerateCodeConfirmation } from "./IGenerateCodeConfirmationGateway";

export class CreateUser implements ICreateUser {
    constructor(
        private readonly repository: IUserRepository,
        private readonly generateCodeConfirmation: IGenerateCodeConfirmation,
        private readonly logger: ILogger
    ) { }

    async execute(dto: CreateUserDto): Promise<UserCreatedDto> {
        try {
            this.logger.info("CreateUser - Executando servico para criacao do usuario");
            this.logger.info("CreateUser - Criando usuario")
            const user = User.create(dto.email, dto.password, dto.userType)
            await this.repository.save(user)
            this.logger.info("CreateUser - Salvando usuario")
            this.logger.info("CreateUser - Chamando servico para geracao de codigo para confirmacao de E-mail")
            await this.generateCodeConfirmation.generateCode(user.email)
            return { userId: user.userId }
        } catch (error: any) {
            this.logger.error(`CreateUser - Error: ${error.message}`)
            throw error
        }
    }
}