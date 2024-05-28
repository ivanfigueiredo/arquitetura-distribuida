import { IClientRepository } from "../application/IClientRepository"
import { Client } from "../domain/Client";
import { IUnitOfWorkInfra } from './IUnitOfWorkInfra';
import { ClientEntity } from "./entities/ClientEntity";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";

export class ClientDatabase implements IClientRepository {
    constructor(private readonly unitOfWork: IUnitOfWorkInfra) {}

    async save(client: Client): Promise<void> {
        try {
            await this.unitOfWork.transaction(ClientEntity.from(client));
        } catch (error) {
            console.log('===================>>>>>> ERROR', error);
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }
}