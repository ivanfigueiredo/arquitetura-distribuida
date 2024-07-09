import { ILogger, IStateManeger } from "expense-core";
import { IExcludeAddress } from "./IExcludeAddress";
import { IAddressRepository } from "./IAddressRepository";
import { AddressIncludedDto } from "./dto/AddressIncludedDto";

export class ExcludeAddress implements IExcludeAddress {
    constructor(
        private readonly stateManager: IStateManeger,
        private readonly addressRepository: IAddressRepository,
        private readonly logger: ILogger
    ) { }

    async execute(): Promise<void> {
        try {
            this.logger.info(`ExcludeAddress - Iniciando microsservico para exclusao do endereco`)
            this.logger.info(`ExcludeAddress - Recuperando Estado de IncludeAddress6`)
            const addressIncluded = await this.stateManager.get<AddressIncludedDto>('AddressIncluded')
            if (addressIncluded) {
                const address = await this.addressRepository.findAddressById(addressIncluded.id)
                if (address) {
                    this.logger.info(`ExcludeAddress - Excluindo endereco cadastrado`)
                    await this.addressRepository.delete(address)
                }
            }
            this.logger.info(`ExcludeAddress - Estado nao recuperado`)
        } catch (error: any) {
            this.logger.error(`ExcludeAddress - Error: ${error.message}`)
        }
    }
}