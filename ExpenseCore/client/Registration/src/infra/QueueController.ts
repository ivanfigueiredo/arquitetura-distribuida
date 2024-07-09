import { IClientRegistration } from "../application/IClientRegistration";
import { ILogger, Queue } from "expense-core";
import { ClientRegistrationDto } from "../application/dto/ClientRegistrationDto";
import { ICreateClient } from "../application/ICreateClient";
import { UserInfoDto } from "../application/dto/UserInfoDto";
import { IClientIncludeAddressError } from "../application/IClientIncludeAddressError";
import { IClientIncludeDocumentError } from "../application/IClientIncludeDocumentError";
import { ClientIncludeAddressErrorDto } from "../application/dto/ClientIncludeAddressErrorDto";
import { ClientIncludeDocumentErrorDto } from "../application/dto/ClientIncludeDocumentErrorDto";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly clientRegistration: IClientRegistration,
        readonly logger: ILogger,
        readonly createClient: ICreateClient,
        readonly clientIncludeAddressError: IClientIncludeAddressError,
        readonly clientIncludeDocumentError: IClientIncludeDocumentError
    ) {
        queue.consume("client.registration.queue", "client.events", "client.registration", async (input: ClientRegistrationDto) => {
            logger.info("Recebendo evento para cadastro do cliente")
            await clientRegistration.execute(input);
        })
        queue.consume('user.info.queue', 'user.events', 'user.info', async (input: UserInfoDto) => {
            logger.info("Recebendo evento para criacao do cliente")
            await createClient.execute(input)
        })
        queue.consume('client.include-address.error.queue', 'client.events', 'client.include-address.error', async (input: ClientIncludeAddressErrorDto) => {
            logger.info("Recebendo evento para compensacao do cliente - Endereco")
            await clientIncludeAddressError.execute(input)
        })
        queue.consume('client.include-document.error.queue', 'client.events', 'client.include-document.error', async (input: ClientIncludeDocumentErrorDto) => {
            logger.info("Recebendo evento para compensacao do cliente - Documento")
            await clientIncludeDocumentError.execute(input)
        })
    }
}