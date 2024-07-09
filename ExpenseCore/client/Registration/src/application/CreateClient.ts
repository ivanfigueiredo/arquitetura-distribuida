import { ILogger, IStateManeger, Queue } from "expense-core";
import { ICreateClient } from "./ICreateClient";
import { UserInfoDto } from "./dto/UserInfoDto";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";
import { IClientRepository } from "./IClientRepository";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { Client } from "../domain/Client";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";

export class CreateClient implements ICreateClient {
    constructor(
        private readonly repository: IClientRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly logger: ILogger,
        private readonly queue: Queue
    ) { }

    public async execute(dto: UserInfoDto): Promise<void> {
        try {
            this.logger.info(`CreateClient - Iniciando Step para criacao do cliente`)
            await this.unitOfWork.startTransaction();
            this.logger.info(`CreateClient - Recuperando estado da execucao`)
            const createClientDto = await this.stateManager.get<ClientRegistrationDto>('createClient')
            if (!createClientDto) {
                throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
            }
            const client = Client.create(
                createClientDto.clientType,
                dto.email,
                dto.userId,
                createClientDto.phoneNumber,
                createClientDto.contact,
                createClientDto.name,
                createClientDto.companyReason,
                createClientDto.fullName,
                createClientDto.birthDate
            )
            await this.repository.save(client)
            await this.unitOfWork.commit()
            this.logger.info(`CreateClient - Client Salvo com sucesso`)
            this.logger.info(`CreateClient - Chamando microsservico para cadastro do documento`)
            await this.queue.publish(
                'client.events',
                'client.include-document',
                {
                    clientId: client.id,
                    documentName: createClientDto.document.documentType,
                    documentNumber: createClientDto.document.documentNumber
                }
            )
            this.logger.info('CreateClient - Chamando microsservico para cadastro do endereco')
            await this.queue.publish(
                'client.events',
                'client.include-address',
                {
                    clientId: client.id,
                    city: createClientDto.address.city,
                    street: createClientDto.address.street,
                    postalCode: createClientDto.address.postalCode,
                    state: createClientDto.address.state,
                    country: createClientDto.address.country
                }
            )
            await this.stateManager.set<ClientCreatedDto>('ClientCreated', { clientId: client.id })
        } catch (error: any) {
            this.logger.error(`CreateClient - Error: ${error.message}`)
            await this.queue.publish('client.events', 'client.registration.error', { error: { message: error.message } })
        }
    }
}