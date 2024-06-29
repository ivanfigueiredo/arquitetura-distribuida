import { ILogger } from "expense-core";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { IConfirmationEmail } from "./IConfirmationEmail";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IUserRepository } from "./IUserRepository";
import { ConfirmationEmailDto } from "./dto/ConfirmationEmailDto";

export class ConfirmationEmail implements IConfirmationEmail {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ConfirmationEmailDto): Promise<void> {
        try {
            this.logger.info(`ConfirmationEmail - Iniciando microsservico para confirmacao do E-mail`)
            await this.unitOfWork.startTransaction()
            const user = await this.userRepository.finUserByEmailAndCode(dto.email, dto.code)
            if (user) {
                this.logger.info(`ConfirmationEmail - Confirmando o E-mail: ${dto.email}`)
                user.confirmedEmail()
                await this.userRepository.save(user)
            }
            await this.unitOfWork.commit()
            this.logger.info("E-mail confirmado com sucesso")
        } catch (error: any) {
            this.logger.error(`ConfirmationEmail - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.error(`ConfirmationEmail - Fazendo rollback nos dados`)
                await this.unitOfWork.rollBack()
            }
            throw error
        }
    }
}