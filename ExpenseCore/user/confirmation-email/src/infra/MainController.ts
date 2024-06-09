import { IConfirmationEmail } from "../application/IConfirmationEmail";
import { HttpClient } from "./HttpClient"

export class MainCoontroller {
    constructor(
        readonly httpClient: HttpClient,
        readonly confirmationEmail: IConfirmationEmail
    ) {
        httpClient.on("post", "/verify", async function (params: any, data: any) {
            const output = await confirmationEmail.execute(data);
            return output;
        });
    }
}