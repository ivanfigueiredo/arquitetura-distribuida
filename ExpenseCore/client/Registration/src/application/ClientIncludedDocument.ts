import { ILogger, IStateManeger, Queue } from "expense-core";
import { ClientIncludedDocumentDto } from "./dto/ClientIncludedDocumentDto";
import { IClientIncludedDocument } from "./IClientIncludedDocument";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { IClientRepository } from "./IClientRepository";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";
import { CreatedClientEventDto } from "./dto/CreatedClientEventDto";

export class ClientIncludedDocument implements IClientIncludedDocument {
    constructor(
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly clientRepository: IClientRepository,
        private readonly queue: Queue,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ClientIncludedDocumentDto): Promise<void> {
        try {
            this.logger.info(`ClientIncludedDocument - Iniciando Step 3 para criacao do cliente`)
            this.logger.info(`ClientIncludedDocument - Recuperando Estado da execucao CreateClient`)
            const clientCreated = await this.stateManager.get<ClientCreatedDto>('ClientCreated')
            const createClientDto = await this.stateManager.get<ClientRegistrationDto>('createClient')
            if (dto.error && createClientDto) {
                if (clientCreated) {
                    await this.unitOfWork.startTransaction();
                    this.logger.info(`ClientIncludedDocument - Recuperando cliente`)
                    const client = await this.clientRepository.findClientById(clientCreated.clientId)
                    if (client) {
                        this.logger.info(`ClientIncludedDocument - Excluindo cliente`)
                        await this.clientRepository.delete(client)
                    }
                    await this.unitOfWork.commit()
                } else {
                    this.logger.info('ClientIncludedDocument - Estado nao recuperado')
                }
                await this.queue.publish(
                    'client.events', 
                    'client.registration.error', 
                    { 
                        error: { 
                            message: dto.error.message,
                            statusCode: dto.error.status,
                            timestamp: new Date().toISOString()
                        },
                        data: {
                            userId: createClientDto.userId
                        }
                    }
                )
                return
            }            
            if (createClientDto && clientCreated && dto.document) {
                const clientCreatedEvent = new CreatedClientEventDto(
                    clientCreated.clientId,
                    createClientDto.name,
                    createClientDto.fullName,
                    createClientDto.companyReason,
                    createClientDto.phoneNumber,
                    createClientDto.userId,
                    createClientDto.birthDate,
                    createClientDto.clientType,
                    createClientDto.contact,
                    {
                        documentId: dto.document.id,
                        documentType: dto.document.documentName,
                        documentNumber: dto.document.documentNumber
                    }

                )
                this.logger.info('ClientIncludedDocument - Salvando Estado do Evento de sucesso do cliente')
                await this.stateManager.set<CreatedClientEventDto>('ClientEventCreated', clientCreatedEvent)
                this.logger.info('ClientIncludedDocument - Chamando microsservico para cadastro do endereco')
                await this.queue.publish(
                    'client.events',
                    'client.include-address',
                    {
                        clientId: clientCreated.clientId,
                        city: createClientDto.address.city,
                        street: createClientDto.address.street,
                        postalCode: createClientDto.address.postalCode,
                        state: createClientDto.address.state,
                        country: createClientDto.address.country
                    }
                )
            }
        } catch (error: any) {
            this.logger.error(`ClientIncludedDocument - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.error('ClientIncludedDocument - Fazendo rollback nos dados')
                await this.unitOfWork.rollBack()
            }
        }
    }
}