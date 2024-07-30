import { ILogger } from "expense-core"
import { IClientRepository } from "../application/IClientRepository"
import { Client } from "../domain/Client"
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra'
import { ContactEntity, ProfileEntity } from "./entities"
import { ClientEntity } from "./entities/ClientEntity"
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException"

export class ClientDatabase implements IClientRepository {
    constructor(
        private readonly unitOfWork: IUnitOfWorkInfra,
        private readonly logger: ILogger
    ) { }

    async save(client: Client): Promise<void> {
        try {
            await this.unitOfWork.transaction<ClientEntity>(ClientEntity.from(client))
            await this.unitOfWork.transaction<ProfileEntity>(
                new ProfileEntity(client.id, client.fullName, client.phoneNumber, client.birthDate, new Date(), new Date(), ClientEntity.from(client))
            )
            await this.unitOfWork.transaction<ContactEntity>(
                new ContactEntity(
                    client.contact.clientId,
                    client.contact.name,
                    client.contact.phoneNumber,
                    client.contact.email,
                    client.contact.relationship,
                    ClientEntity.from(client)
                )
            )
        } catch (error: any) {
            this.logger.error(`ClientDatabase - [save] - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        }
    }

    async delete(client: Client): Promise<void> {
        try {
            await this.unitOfWork.delete<ProfileEntity>(ProfileEntity, { clientId: client.id })
            await this.unitOfWork.delete<ContactEntity>(ContactEntity, { clientId: client.id })
            await this.unitOfWork.delete<ClientEntity>(ClientEntity, { clientId: client.id })
        } catch (error: any) {
            this.logger.error(`ClientDatabase - [delete] - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        }
    }

    async findClientById(clientId: string): Promise<Client | null> {
        const client = await this.unitOfWork.findOne(clientId)
        if (client) return client.to()
        return null
    }
}