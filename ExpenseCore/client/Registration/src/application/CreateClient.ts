import { ILogger, IStateManeger, Queue, IIdempotency, ConcurrencyException } from "expense-core";
import { ICreateClient } from "./ICreateClient";
import { UserInfoDto } from "./dto/UserInfoDto";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";
import { IClientRepository } from "./IClientRepository";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { Client } from "../domain/Client";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { RetrieveClientProcessedDto } from "./dto/RetrieveClientProcessedDto";

export class CreateClient implements ICreateClient {
    constructor(
        private readonly repository: IClientRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly logger: ILogger,
        private readonly queue: Queue,
        private readonly idempotencyManager: IIdempotency
    ) { }

    public async execute(dto: UserInfoDto): Promise<void> {
        try {
            this.logger.info(`CreateClient - Iniciando Step 2 para criacao do cliente`)
            this.logger.info(`CreateClient - Validando Idempotencia`)
            await this.idempotencyManager.checkIdempotency({userId: dto.userId})
            const payload = await this.idempotencyManager.retrieveProcessedResult<RetrieveClientProcessedDto>()
            if (payload) {
                this.logger.info('CreateClient - Evento já processado')
                await this.publish(payload)
                return
            }
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
            const data: RetrieveClientProcessedDto = {
                clientId: client.id,
                documentName: createClientDto.document.documentType,
                documentNumber: createClientDto.document.documentNumber
            }
            this.logger.info('CreateClient - Salvando estado do evento processado')
            await this.idempotencyManager.saveIdempotency<{userId: string}, RetrieveClientProcessedDto>({userId: dto.userId}, data)
            this.logger.info('CreateClient - Salvando Estado da criacao do Cliente')
            await this.stateManager.set<ClientCreatedDto>('ClientCreated', { clientId: client.id })
            this.logger.info(`CreateClient - Client Salvo com sucesso`)
            await this.idempotencyManager.updateIdempotencyStatus()
            this.logger.info(`CreateClient - Chamando microsservico para cadastro do documento`)
            await this.publish(data)
        } catch (error: any) {
            this.logger.error(`CreateClient - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.error('CreateClient - Fazendo rollback')
                await this.unitOfWork.rollBack()
            }
            if (error.message === 'Concurrent transaction.') {
                throw error
            }
            await this.queue.publish('client.events', 'client.registration.error', { 
                error: { 
                    message: error.message,
                    statusCode: error.status,
                    timestamp: new Date().toISOString()
                } 
            })
        }
    }

    private async publish(payload: RetrieveClientProcessedDto): Promise<void> {
        const {clientId, documentName, documentNumber} = payload
        await this.queue.publish(
            'client.events',
            'client.include-document',
            {
                clientId,
                documentName,
                documentNumber
            }
        )
    }
}