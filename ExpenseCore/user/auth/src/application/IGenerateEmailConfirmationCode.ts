import { Output } from "./IAuth";
import { GenerateEmailConfirmationCodeDto } from "./SignInDto";

export interface IGenerateEmailConfirmationCode {
    execute(dto: GenerateEmailConfirmationCodeDto): Promise<void>
}