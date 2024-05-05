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

        httpClient.on("get", "/testee", async function (params: any, data: any) {
            console.log('========================>>>>>>>> TESTEEEEEEE');
            const body = {
                name: "Ivan Figueiredo",
                email: "ivan.figueiredo@gmail.com",
                password: "123456",
                birthdate: "1986/12/30",
                budget: {
                    totalLimit: 1000,
                    startDate: "2024-05-01T18:16:02.811Z"
                }
            }
        const payload = '{ "name": "Ivan Figueiredo", "email": "ivan.figueiredo@gmail.com", "password": "123456", "birthdate": "1986/12/30", "bugget": { "totalLimit": 1000, "startDate": "2024-05-01T18:16:02.811Z" } }';

            // const stringValue = JSON.stringify(body);
            const value = JSON.parse(payload);
            console.log('========================>>>>>>> PAYLOAD', value);

            return value;
        })
    }
}