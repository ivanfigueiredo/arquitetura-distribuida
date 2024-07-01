import { IClientRegistration } from "../application/IClientRegistration";
import { ILogger, Queue } from "expense-core";
import { ClientRegistrationDto } from "../application/dto/ClientRegistrationDto";
import { ICreateClient } from "../application/ICreateClient";
import { UserInfoDto } from "../application/dto/UserInfoDto";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly clientRegistration: IClientRegistration,
        readonly logger: ILogger,
        readonly createClient: ICreateClient
    ) {
        queue.consume("client.registration.queue", "client.events", "client.registration", async (input: ClientRegistrationDto) => {
            logger.info("Recebendo evento para cadastro do cliente")
            await clientRegistration.execute(input);
        })

        queue.consume('user.info.queue', 'user.events', 'user.info', async (input: UserInfoDto) => {
            logger.info("Recebendo evento para criacao do cliente")
            await createClient.execute(input)
        })
    }
}