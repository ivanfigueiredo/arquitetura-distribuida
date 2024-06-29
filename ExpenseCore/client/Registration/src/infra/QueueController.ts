import { IClientRegistration } from "../application/IClientRegistration";
import { ILogger, Queue } from "expense-core";
import { ClientRegistrationDto } from "../application/dto/ClientRegistrationDto";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly clientRegistration: IClientRegistration,
        readonly logger: ILogger
    ) {
        queue.consume("client.registration.queue", "client.events", "client.registration", async (input: ClientRegistrationDto) => {
            logger.info("Recebendo evento para cadastro do cliente")
            await clientRegistration.execute(input);
        });
    }
}