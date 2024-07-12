import { ILogger, IStateManeger, Queue } from "expense-core";
import { ClientIncludedAddressDto } from "./dto/ClientIncludedAddressDto";
import { IClientIncludedAddress } from "./IClientIncludedAddress";
import { CreatedClientEventDto } from "./dto/CreatedClientEventDto";

export class ClientIncludedAddress implements IClientIncludedAddress {
    constructor(
        private readonly stateManager: IStateManeger,
        private readonly queue: Queue,
        private readonly logger: ILogger
    ) { }

    async execute(dto: ClientIncludedAddressDto): Promise<void> {
        try {
            this.logger.info(`ClientIncludedAddress - Iniciando Step 4 para criacao do cliente`)
            this.logger.info(`ClientIncludedAddress - Recuperando Estado do evento de sucesso da criacao do cliente`)
            const clientCreatedEvent = await this.stateManager.get<CreatedClientEventDto>('ClientEventCreated')
            if (clientCreatedEvent && dto.address) {
                const eventDto = {
                    ...clientCreatedEvent,
                    address: {
                        addressId: dto.address.id,
                        state: dto.address.state,
                        city: dto.address.city,
                        country: dto.address.country,
                        postalCode: dto.address.postalCode,
                        street: dto.address.street
                    }
                }
                this.logger.info('ClientIncludedAddress - Cliente criado com sucesso. Publicando evento de sucesso')
                await this.queue.publish('client.events', 'client.registration.created', eventDto)
            }
            if (dto.error) {
                this.logger.info('ClientIncludedAddress - Chamadno servico para exclusao do documento')
                await this.queue.publish('client.events', 'client.exclude-document', {})
                this.logger.info('ClientIncludedAddress - Chamando servico para exclusao do cliente')
                await this.queue.publish('client.events', 'client.registration.step-5', { error: { message: dto.error.message } })
            }
            this.logger.info('ClientIncludedAddress - Estado nao recuperado')
        } catch (error: any) {
            this.logger.error(`ClientIncludedAddress - Error: ${error.message}`)
            await this.queue.publish('client.events', 'client.registration.error', { error: { message: error.message } })
        }
    }
}