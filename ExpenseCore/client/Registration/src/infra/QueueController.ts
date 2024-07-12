import { IClientRegistration } from "../application/IClientRegistration";
import { ILogger, Queue } from "expense-core";
import { ClientRegistrationDto } from "../application/dto/ClientRegistrationDto";
import { ICreateClient } from "../application/ICreateClient";
import { UserInfoDto } from "../application/dto/UserInfoDto";
import { IClientIncludedAddress } from "../application/IClientIncludedAddress";
import { IClientIncludedDocument } from "../application/IClientIncludedDocument";
import { ClientIncludedAddressDto } from "../application/dto/ClientIncludedAddressDto";
import { ClientIncludedDocumentDto } from "../application/dto/ClientIncludedDocumentDto";
import { IExcludeClient } from "../application/IExcludeClient";
import { ExcludeClientDto } from "../application/dto/ExcludeClientDto";

export default class QueueController {

    constructor(
        readonly queue: Queue,
        readonly clientRegistration: IClientRegistration,
        readonly logger: ILogger,
        readonly createClient: ICreateClient,
        readonly clientIncludedAddress: IClientIncludedAddress,
        readonly clientIncludedDocument: IClientIncludedDocument,
        readonly excludeClient: IExcludeClient
    ) {
        queue.consume("client.registration.queue", "client.events", "client.registration", async (input: ClientRegistrationDto) => {
            logger.info("Recebendo evento para cadastro do cliente")
            await clientRegistration.execute(input);
        })
        queue.consume('client.registration.step-2.queue', 'client.events', 'client.registration.step-2', async (input: UserInfoDto) => {
            logger.info("Recebendo evento para criacao do cliente")
            await createClient.execute(input)
        })
        queue.consume('client.registration.step-3.queue', 'client.events', 'client.registration.step-3', async (input: ClientIncludedDocumentDto) => {
            logger.info("Recebendo evento de inclusao do documento")
            await clientIncludedDocument.execute(input)
        })
        queue.consume('client.registration.step-4.queue', 'client.events', 'client.registration.step-4', async (input: ClientIncludedAddressDto) => {
            logger.info("Recebendo evento de inclusao do endereco")
            await clientIncludedAddress.execute(input)
        })
        queue.consume('client.registration.step-5.queue', 'client.events', 'client.registration.step-5', async (input: ExcludeClientDto) => {
            logger.info('Recebendo evento para exclusao do cliente')
            await excludeClient.execute(input)
        })
    }
}