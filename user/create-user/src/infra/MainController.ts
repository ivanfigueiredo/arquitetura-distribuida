import { ICreateUser } from '../application/ICreateUser';
import { HttpClient } from "./HttpClient"
import { ISpan } from './ISpan';

export class MainCoontroller {
    constructor(
        readonly context: ISpan,
        readonly httpClient: HttpClient,
        readonly createUser: ICreateUser
    ) {
        httpClient.on("post", "/create-user", async function (params: any, data: any) {
            const output = await createUser.execute(data);
            return output;
		});
    }
}