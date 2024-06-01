import { Output } from "./IAuth";
import { GenerateEmailConfirmationTokenDto } from "./SignInDto";

export interface IGenerateEmailConfirmationToken {
    execute(dto: GenerateEmailConfirmationTokenDto): Promise<void>
}