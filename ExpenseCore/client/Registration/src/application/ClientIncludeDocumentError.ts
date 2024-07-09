import { ILogger, IStateManeger, Queue } from "expense-core";
import { ClientIncludeDocumentErrorDto } from "./dto/ClientIncludeDocumentErrorDto";
import { IClientIncludeDocumentError } from "./IClientIncludeDocumentError";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { IClientRepository } from "./IClientRepository";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";

export class ClientIncludeDocumentError implements IClientIncludeDocumentError {
    constructor(
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly clientRepository: IClientRepository,
        private readonly queue: Queue,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ClientIncludeDocumentErrorDto): Promise<void> {
        try {
            this.logger.info(`ClientIncludeDocumentError - Iniciando microsservico para compensacao do cliente`)
            this.logger.info(`ClientIncludeDocumentError - Recuperando Estado da execucao CreateClient`)
            const clientCreated = await this.stateManager.get<ClientCreatedDto>('ClientCreated')
            if (clientCreated) {
                await this.unitOfWork.startTransaction();
                this.logger.info(`ClientIncludeDocumentError - Recuperando cliente`)
                const client = await this.clientRepository.findClientById(clientCreated.clientId)
                if (client) {
                    this.logger.info(`ClientIncludeDocumentError - Inativando cliente`)
                    client.canceledClient()
                    await this.clientRepository.save(client)
                }
                await this.unitOfWork.commit()
                this.logger.info('ClientIncludeDocumentError - Chamadno servico para exclusao do endereco')
                await this.queue.publish('client.events', 'client.exclude-address', {})
            }
        } catch (error: any) {
            this.logger.error(`ClientIncludeDocumentError - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.error('ClientIncludeDocumentError - Fazendo rollback nos dados')
                await this.unitOfWork.rollBack()
            }
        }
    }
}