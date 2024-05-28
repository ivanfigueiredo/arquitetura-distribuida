import { HttpClient } from "./HttpClient"

export class MainCoontroller {
    constructor(readonly httpClient: HttpClient) {
        httpClient.on("post", "/create-user", async function (params: any, data: any) {
            return data;
        });
    }
}