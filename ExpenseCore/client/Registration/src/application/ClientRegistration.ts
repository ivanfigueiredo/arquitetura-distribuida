import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IClientRepository } from "./IClientRepository";
import { IClientRegistration } from "./IClientRegistration";
import { ClientDto } from "./dto/ClientDto";
import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { Client } from "../domain/Client";

export class ClientRegistration implements IClientRegistration {
    constructor(
        private readonly repository: IClientRepository,
        private readonly unitOfWork: IUnitOfWorkApplication
    ) {}

    async execute(dto: ClientDto): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const client = Client.create(dto.clientType, dto.email, dto.userId, dto.name, dto.companyReason);  
            
            await this.repository.save(client);
            await this.unitOfWork.commit();
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