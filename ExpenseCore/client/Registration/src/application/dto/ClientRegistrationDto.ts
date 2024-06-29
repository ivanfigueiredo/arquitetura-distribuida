import { AddressDto } from "./AddressDto";
import { ContactDto } from "./ContactDto";
import { DocumentDto } from "./DocumentDto";

export class ClientRegistrationDto {
    constructor(
        readonly name: string | undefined,
        readonly fullName: string | undefined,
        readonly companyReason: string | undefined,
        readonly phoneNumber: string,
        readonly userId: string,
        readonly birthDate: string | undefined,
        readonly clientType: string,
        readonly email: string,
        readonly address: AddressDto,
        readonly contact: ContactDto,
        readonly document: DocumentDto
    ) { }
}