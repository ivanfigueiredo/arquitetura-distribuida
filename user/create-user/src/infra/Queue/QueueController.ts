import { ICreateUser } from "../../application/ICreateUser";
import Queue from "./Queue";

export default class QueueController {
	
	constructor (
        readonly queue: Queue,
        readonly createUser: ICreateUser
    ) {
        queue.consume("user.created.queue", async (input: any) => {
            await createUser.execute(input);
		});
	}
}