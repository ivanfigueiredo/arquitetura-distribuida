import { IUserService } from '../application/IUserService';
import { HttpClient } from "./HttpClient"

export class MainCoontroller {
    constructor(
        readonly httpClient: HttpClient,
        readonly userService: IUserService
    ) {
        httpClient.on("post", "/create-user", async function (params: any, data: any) {
            return userService.createUser(data);
		});
        httpClient.on("get", "/test", async function (params: any, data: any) {
            return 'OK'
        })
    }
}