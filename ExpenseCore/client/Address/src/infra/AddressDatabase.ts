import { ILogger } from "expense-core";
import { InternalServerErrorException } from "./exceptions/InternalServerErrorException";
import { Repository } from "typeorm";
import { DatabaseConnection } from "./DatabaseConnection";
import { IAddressRepository } from "../application/IAddressRepository";
import { Address } from "../domain/Address";
import { AddressEntity } from "./entities/AddressEntity";

export class AddressDatabase implements IAddressRepository {
    private readonly repository: Repository<AddressEntity>

    constructor(
        private readonly connection: DatabaseConnection,
        private readonly logger: ILogger
    ) {
        this.repository = this.connection.getDataSourcer().getRepository(AddressEntity)
    }

    async save(address: Address): Promise<void> {
        try {
            await this.repository.save(AddressEntity.from(address))
        } catch (error: any) {
            this.logger.error(`AddressDatabase - Error: ${error.message}`)
            throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500);
        }
    }

    async findAddressById(addressId: string): Promise<Address | null> {
        const addressEntity = await this.repository.findOne({ where: { addressId } })
        if (!addressEntity) return null
        return addressEntity.to()
    }

    async delete(address: Address): Promise<void> {
        await this.repository.delete({ addressId: address.id })
    }
}