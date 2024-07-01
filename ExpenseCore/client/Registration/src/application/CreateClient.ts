import { ILogger, IStateManeger } from "expense-core";
import { ICreateClient } from "./ICreateClient";
import { UserInfoDto } from "./dto/UserInfoDto";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";

export class CreateClient implements ICreateClient {
    constructor(
        private readonly stateManager: IStateManeger,
        private readonly logger: ILogger
    ) { }

    public async execute(dto: UserInfoDto): Promise<void> {
        this.logger.info(`CreateClient - Iniciando Step para criacao do cliente`)
        this.logger.info(`CreateClient - Recuperando estado da execucao`)
        const createClientDto = await this.stateManager.get<ClientRegistrationDto>('createClient')
        console.log('===============>>>>>>> DTO: ', dto)
        console.log('======================>>>>>>> Estado: ', createClientDto)
    }
}