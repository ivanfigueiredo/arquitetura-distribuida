import { ClientIncludeAddressErrorDto } from "./dto/ClientIncludeAddressErrorDto";

export interface IClientIncludeAddressError {
    execute(dto: ClientIncludeAddressErrorDto): Promise<void>
}