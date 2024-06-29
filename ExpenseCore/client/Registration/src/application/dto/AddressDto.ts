export class AddressDto {
    constructor(
        readonly state: string,
        readonly city: string,
        readonly country: string,
        readonly postalCode: string,
        readonly street: string
    ) { }
}