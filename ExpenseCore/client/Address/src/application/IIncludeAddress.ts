import { IncludeAddressDto } from "./dto/IncludeAddressDto";

export interface IIncludeAddress {
    execute(dto: IncludeAddressDto): Promise<void>
}