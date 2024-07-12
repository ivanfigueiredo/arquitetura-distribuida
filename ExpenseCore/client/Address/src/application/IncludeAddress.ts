import { ILogger, Queue } from "expense-core";
import { IncludeAddressDto } from "./dto/IncludeAddressDto";
import { IAddressRepository } from "./IAddressRepository";
import { IIncludeAddress } from "./IIncludeAddress";
import { Address } from "../domain/Address";

export class IncludeAddress implements IIncludeAddress {
    constructor(
        private readonly addressRepository: IAddressRepository,
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
            this.logger.info('IncludeAddress - Chamando ClientRegistration')
            await this.queue.publish(
                'client.events',
                'client.registration.step-4',
                {
                    address: {
                        id: address.id,
                        city: address.city,
                        street: address.street,
                        postalCode: address.postalCode,
                        state: address.state,
                        country: address.country
                    },
                    error: undefined
                }
            )
        } catch (error: any) {
            this.logger.error(`IncludeAddress - Error: ${error.message}`)
            await this.queue.publish(
                'client.events',
                'client.registration.step-4',
                {
                    address: undefined,
                    error: { message: error.message }
                }
            )
        }
    }
}