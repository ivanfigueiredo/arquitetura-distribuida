import { IAuth } from '../application/IAuth'
import { IGenerateEmailConfirmationCode } from '../application/IGenerateEmailConfirmationCode'
import { IValidationToken } from '../application/IValidationToken';
import { HttpClient } from "./HttpClient"

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: IAuth,
        readonly generateCode: IGenerateEmailConfirmationCode,
        readonly tokenValidate: IValidationToken

    ) {
        httpClient.on("post", "/auth", async function (params: any, data: any) {
            const output = await auth.execute(data);
            return output;
        })
        httpClient.on("post", "/generate-email-confirmation-code", async function (params: any, data: any) {
            await generateCode.execute(data);
        })
        httpClient.on("post", "/validation-token", async function (params: any, data: any) {
            return tokenValidate.execute(data)
        })
    }
}