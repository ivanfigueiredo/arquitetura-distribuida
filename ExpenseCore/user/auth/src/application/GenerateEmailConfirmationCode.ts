import { ILogger } from 'expense-core';
import { ICodeRepository } from './ICodeRepository';
import { Code } from "../domain/Code";
import { IAuthGateway } from "./IAuthGateway";
import { IGenerateEmailConfirmationCode } from "./IGenerateEmailConfirmationCode";
import { GenerateEmailConfirmationCodeDto } from "./SignInDto";

export class GenerateEmailConfirmationCode implements IGenerateEmailConfirmationCode {
    constructor(
        private readonly codeRepository: ICodeRepository,
        private readonly authGateway: IAuthGateway,
        private readonly logger: ILogger
    ) { }

    async execute(dto: GenerateEmailConfirmationCodeDto): Promise<void> {
        this.logger.info("GenerateEmailConfirmationCode - Executando microsservico para geracao de codigo de validacao")
        const code = Code.create(dto.email)
        this.logger.info(`GenerateEmailConfirmationCode - Codigo gerado para ${dto.email} com sucesso`)
        await this.codeRepository.save(code)
        this.logger.info("GenerateEmailConfirmationCode - Chamando servico para notificacao de E-MAIL")
        await this.authGateway.createUserNotification({ email: dto.email, code: code.code })
    }
}