export class ClientDto {
    constructor(
        readonly clientType: string,
        readonly email: string,
        readonly userId: string,
        readonly name?: string,
        readonly companyReason?: string
    ) {}
}