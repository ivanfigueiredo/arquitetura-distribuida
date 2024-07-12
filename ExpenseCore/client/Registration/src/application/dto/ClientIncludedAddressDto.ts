export class ClientIncludedAddressDto {
    constructor(
        readonly address?: {
            id: string
            city: string
            street: string
            postalCode: string
            state: string
            country: string
        },
        readonly error?: {
            message: string
        }
    ) { }
}