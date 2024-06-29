import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IClientRepository } from "./IClientRepository";
import { IClientRegistration } from "./IClientRegistration";
import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { Client } from "../domain/Client";
import { ILogger } from "expense-core";

export class ClientRegistration implements IClientRegistration {
    constructor(
        private readonly repository: IClientRepository,
        private readonly unitOfWork: IUnitOfWorkApplication,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ClientRegistrationDto): Promise<void> {
        try {
            this.logger.info("ClientRegistration - Iniciando mmicrosservico para cadastro do cliente")
            console.log('===================>>>>>>> DTO ', dto)
            // await this.unitOfWork.startTransaction();
            // const client = Client.create(dto.clientType, dto.email, dto.userId, dto.name, dto.companyReason);

            // await this.repository.save(client);
            // await this.unitOfWork.commit();
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                console.log('Executando rollback')
                await this.unitOfWork.rollBack();
                throw error;
            }
            throw error;
        }
    }
}