import { ILogger, IStateManeger, Queue } from "expense-core";
import { IncludeAddressDto } from "./dto/IncludeAddressDto";
import { IAddressRepository } from "./IAddressRepository";
import { IIncludeAddress } from "./IIncludeAddress";
import { Address } from "../domain/Address";
import { AddressIncludedDto } from "./dto/AddressIncludedDto";

export class IncludeAddress implements IIncludeAddress {
    constructor(
        private readonly addressRepository: IAddressRepository,
        private readonly stateManager: IStateManeger,
        private readonly logger: ILogger,
        private readonly queue: Queue
    ) { }

    async execute(dto: IncludeAddressDto): Promise<void> {
        try {
            this.logger.info(`IncludeAddress - Iniciando microsservico para inclusao do endereco`)
            const address = Address.create(
                dto.clientId,
                dto.city,
                dto.street,
                dto.postalCode,
                dto.state,
                dto.country
            )
            await this.addressRepository.save(address)
            this.logger.info(`IncludeAddress - Endereco salvo com sucesso`)
            this.logger.info(`IncludeAddress - Salvo Estado da execucao`)
            await this.stateManager.set<AddressIncludedDto>('AddressIncluded', address)
        } catch (error: any) {
            this.logger.error(`IncludeAddress - Error: ${error.message}`)
            await this.queue.publish('client.events', 'client.include-address.error', { error: { message: error.message } })
        }
    }
}