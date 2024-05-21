import { IUserService } from '../application/IUserService';
import { HttpClient } from "./HttpClient"

export class MainCoontroller {
    constructor(
        readonly httpClient: HttpClient,
        readonly userService: IUserService
    ) {
        httpClient.on("post", "/auth", async function (params: any, data: any) {
            return userService.auth(data);
		});
    }
}