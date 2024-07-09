import { Address } from "../domain/Address";

export interface IAddressRepository {
    save(address: Address): Promise<void>
    findAddressById(addressId: string): Promise<Address | null>
    delete(address: Address): Promise<void>
}