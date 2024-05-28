import { IClientRegistration } from '../application/IClientRegistration';
import { HttpClient } from "./HttpClient"

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly clientRegistration: IClientRegistration
    ) {
        httpClient.on("post", "/create-client", async function (params: any, data: any) {
            await clientRegistration.execute(data);
		});
    }
}