import { ILogger, IStateManeger, Queue } from "expense-core";
import { ClientIncludeAddressErrorDto } from "./dto/ClientIncludeAddressErrorDto";
import { IClientIncludeAddressError } from "./IClientIncludeAddressError";
import { ClientCreatedDto } from "./dto/ClientCreatedDto";
import { IClientRepository } from "./IClientRepository";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";

export class ClientIncludeAddressError implements IClientIncludeAddressError {
    constructor(
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly stateManager: IStateManeger,
        private readonly queue: Queue,
        private readonly clientRepository: IClientRepository,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ClientIncludeAddressErrorDto): Promise<void> {
        try {
            this.logger.info(`ClientIncludeAddressError - Iniciando microsservico para compensacao do cliente`)
            this.logger.info(`ClientIncludeAddressError - Recuperando Estado da execucao CreateClient`)
            const clientCreated = await this.stateManager.get<ClientCreatedDto>('ClientCreated')
            if (clientCreated) {
                await this.unitOfWork.startTransaction();
                this.logger.info(`ClientIncludeAddressError - Recuperando cliente`)
                const client = await this.clientRepository.findClientById(clientCreated.clientId)
                if (client) {
                    this.logger.info(`ClientIncludeAddressError - Inativando cliente`)
                    client.canceledClient()
                    await this.clientRepository.save(client)
                }
                await this.unitOfWork.commit()
                this.logger.info('ClientIncludeAddressError - Chamadno servico para exclusao do documento')
                await this.queue.publish('client.events', 'client.exclude-document', {})
            }
        } catch (error: any) {
            this.logger.error(`ClientIncludeAddressError - Error: ${error.message}`)
            if (error instanceof InternalServerErrorException) {
                this.logger.error('ClientIncludeAddressError - Fazendo rollback nos dados')
                await this.unitOfWork.rollBack()
            }
        }
    }
}