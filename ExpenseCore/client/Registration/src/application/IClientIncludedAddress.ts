import { ClientIncludedAddressDto } from "./dto/ClientIncludedAddressDto";

export interface IClientIncludedAddress {
    execute(dto: ClientIncludedAddressDto): Promise<void>
}