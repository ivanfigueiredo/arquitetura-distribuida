import { IAuth } from '../application/IAuth';
import { IGenerateEmailConfirmationToken } from '../application/IGenerateEmailConfirmationToken';
import { HttpClient } from "./HttpClient"

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly auth: IAuth,
        readonly generateToken: IGenerateEmailConfirmationToken

    ) {
        httpClient.on("post", "/auth", async function (params: any, data: any) {
            const output = await auth.execute(data);
            return output;
        });
        httpClient.on("post", "/generate-email-confirmation-token", async function (params: any, data: any) {
            await generateToken.execute(data);
        })
    }
}