import { IIdempotency, ILogger, Queue } from "expense-core";
import { IncludeAddressDto } from "./dto/IncludeAddressDto";
import { IAddressRepository } from "./IAddressRepository";
import { IIncludeAddress } from "./IIncludeAddress";
import { Address } from "../domain/Address";

export class IncludeAddress implements IIncludeAddress {
    constructor(
        private readonly addressRepository: IAddressRepository,
        private readonly logger: ILogger,
        private readonly queue: Queue,
        private readonly idempotencyManager: IIdempotency
    ) { }

    async execute(dto: IncludeAddressDto): Promise<void> {
        try {
            this.logger.info(`IncludeAddress - Iniciando microsservico para inclusao do endereco`)
            const idempotencyKey = {
                clientId: dto.clientId,
                city: dto.city,
                street: dto.street,
                postalCode: dto.postalCode
            }
            await this.idempotencyManager.checkIdempotency(idempotencyKey)
            const payload = await this.idempotencyManager.retrieveProcessedResult<AddressEvent>()
            if (payload) {
                this.logger.info('IncludeAddress - Evento já processado')
                await this.publish(payload)
                return
            }
            const address = Address.create(
                dto.clientId,
                dto.city,
                dto.street,
                dto.postalCode,
                dto.state,
                dto.country
            )
            this.logger.info(`IncludeAddress - Endereco salvo com sucesso`)
            await this.addressRepository.save(address)
            const payloadEvent: AddressEvent = {
                id: address.id,
                city: address.city,
                street: address.street,
                postalCode: address.postalCode,
                state: address.state,
                country: address.country
            } 
            this.logger.info('IncludeAddress - Salvando estado do evento processado')
            await this.idempotencyManager.saveIdempotency<IdempotencyKey, AddressEvent>(idempotencyKey, payloadEvent)
            this.logger.info('IncludeAddress - Publicando evento')
            await this.publish(payloadEvent)
            this.logger.info('IncludeAddress - Atualizando status processamento do evento')
            await this.idempotencyManager.updateIdempotencyStatus()
        } catch (error: any) {
            this.logger.error(`IncludeAddress - Error: ${error.message}`)
            if (error.message === 'Concurrent transaction.') {
                throw error
            }
            await this.queue.publish(
                'client.events',
                'client.registration.step-4',
                {
                    address: undefined,
                    error: { 
                        message: error.message,
                        status: error.status
                    }
                }
            )
        }
    }

    private async publish(address: AddressEvent): Promise<void> {
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
    }
}

type AddressEvent = Omit<Address, 'clientId'>
type IdempotencyKey = Omit<IncludeAddressDto, 'country' | 'state'>