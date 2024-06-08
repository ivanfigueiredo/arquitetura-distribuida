import { ICodeRepository } from './ICodeRepository';
import { Code } from "../domain/Code";
import { IAuthGateway } from "./IAuthGateway";
import { IGenerateEmailConfirmationCode } from "./IGenerateEmailConfirmationCode";
import { GenerateEmailConfirmationCodeDto } from "./SignInDto";

export class GenerateEmailConfirmationCode implements IGenerateEmailConfirmationCode {
    constructor(
        private readonly codeRepository: ICodeRepository,
        private readonly authGateway: IAuthGateway
    ) { }

    async execute(dto: GenerateEmailConfirmationCodeDto): Promise<void> {
        const code = Code.create(dto.email)
        await this.codeRepository.save(code)
        await this.authGateway.createUserNotification({ email: dto.email, code: code.code });
    }
}