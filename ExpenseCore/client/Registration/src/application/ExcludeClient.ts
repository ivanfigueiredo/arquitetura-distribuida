import { IStateManeger, ILogger, Queue } from "expense-core";
import { IClientRepository } from "./IClientRepository";
import { IExcludeClient } from "./IExcludeClient";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { ExcludeClientDto } from "./dto/ExcludeClientDto";

export class ExcludeClient implements IExcludeClient {
    constructor(
        private readonly repository: IClientRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly logger: ILogger,
        private readonly queue: Queue
    ) { }

    public async execute(dto: ExcludeClientDto): Promise<void> {
        try {
            this.logger.info(`ExcludeClient - Iniciando Step 5 para exclusao do cliente`)
            this.logger.info(`ExcludeClient - Recuperando Estado da execucao CreateClient`)
            const clientCreated = await this.stateManager.get<ClientCreatedDto>('ClientCreated')
            if (clientCreated) {
                await this.unitOfWork.startTransaction();
                this.logger.info(`ExcludeClient - Recuperando cliente`)
                const client = await this.repository.findClientById(clientCreated.clientId)
                if (client) {
                    this.logger.info(`ExcludeClient - Excluindo cliente`)
                    await this.repository.delete(client)
                }
                await this.unitOfWork.commit()
                this.logger.info('ExcludeClient - Publicando evento de erro na criacao do cliente')
                await this.queue.publish('client.events', 'client.registration.error', { 
                    error: { 
                        message: dto.error.message,
                        status: dto.error.status
                    } 
                })
                return
            } else {
                this.logger.info('ExcludeClient - Estado não recuperado')
            }
        } catch (error: any) {
            this.logger.error(`ExcludeClient - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.info('ExcludeClient - Fazendo rollback')
                await this.unitOfWork.rollBack()
            }
            await this.queue.publish('client.events', 'client.registration.error', { 
                error: { 
                    message: dto.error.message,
                    status: dto.error.status
                } 
            })
        }
    }
}