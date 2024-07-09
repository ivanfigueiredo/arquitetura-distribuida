import { randomUUID } from "crypto";

export class Address {
    private constructor(
        readonly id: string,
        readonly clientId: string,
        readonly city: string,
        readonly street: string,
        readonly postalCode: string,
        readonly state: string,
        readonly country: string
    ) { }

    public static create(clientId: string, city: string, street: string, postalCode: string, state: string, country: string): Address {
        const addressId = randomUUID()
        return new Address(addressId, clientId, city, street, postalCode, state, country)
    }

    public static restore(addressId: string, clientId: string, city: string, street: string, postalCode: string, state: string, country: string): Address {
        return new Address(addressId, clientId, city, street, postalCode, state, country)
    }
}