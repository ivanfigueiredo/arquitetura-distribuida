import { IClientRegistration } from "./IClientRegistration";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";
import { ILogger, IStateManeger, Queue } from "expense-core";

export class ClientRegistration implements IClientRegistration {
    constructor(
        private readonly logger: ILogger,
        private readonly stateManager: IStateManeger,
        private readonly queue: Queue

    ) { }

    async execute(dto: ClientRegistrationDto): Promise<void> {
        try {
            this.logger.info("ClientRegistration - Iniciando microsservico para cadastro do cliente")
            this.logger.info("ClientRegistration - Buscando informacao do usuario")
            await this.queue.publish('user.events', 'user.info.recieve', { userId: dto.userId, email: undefined })
            this.logger.info("ClientRegistration - Salvando Estado da execucao")
            await this.stateManager.set("createClient", dto)
        } catch (error: any) {
            this.logger.error(`ClientRegistration - Error: ${error.message}`)
            throw error;
        }
    }
}