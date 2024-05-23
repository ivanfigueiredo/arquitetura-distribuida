import { IAuth } from '../application/IAuth';
import { HttpClient } from "./HttpClient"
import { ISpan } from './ISpan';

export class MainController {
    constructor(
        readonly httpClient: HttpClient,
        readonly usecase: IAuth
    ) {
        httpClient.on("post", "/auth", async function (params: any, data: any) {
            const output = await usecase.execute(data);
            return output;
        });
    }
}