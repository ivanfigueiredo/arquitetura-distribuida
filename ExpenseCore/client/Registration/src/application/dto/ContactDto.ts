export class ContactDto {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly phoneNumber: string,
        readonly relationship: string
    ) { }
}