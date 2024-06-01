import { IAuthGateway } from "./IAuthGateway";
import { IGenerateEmailConfirmationToken } from "./IGenerateEmailConfirmationToken";
import { JWT } from "./JWT";
import { GenerateEmailConfirmationTokenDto } from "./SignInDto";

export class GenerateEmailConfirmationToken implements IGenerateEmailConfirmationToken {
    constructor(private readonly authGateway: IAuthGateway) { }

    async execute(dto: GenerateEmailConfirmationTokenDto): Promise<void> {
        const token = JWT.createToken('72h');
        await this.authGateway.createUserNotification({ email: dto.email, token });
    }
}