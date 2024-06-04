import { IClientRegistration } from "../application/IClientRegistration";
import { Queue } from "expense-core";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly clientRegistration: IClientRegistration
    ) {
        queue.consume("client.registration.queue", "", "", async (input: any) => {
            await clientRegistration.execute(input);
        });
    }
}