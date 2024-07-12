import { ContactDto } from "./ContactDto"

export class CreatedClientEventDto {
    constructor(
        readonly clientId: string,
        readonly name: string | undefined,
        readonly fullName: string | undefined,
        readonly companyReason: string | undefined,
        readonly phoneNumber: string,
        readonly userId: string,
        readonly birthDate: string | undefined,
        readonly clientType: string,
        readonly contact: ContactDto,
        readonly document?: {
            documentId: string
            documentType: string
            documentNumber: string
        },
        readonly address?: {
            addressId: string,
            state: string,
            city: string,
            country: string,
            postalCode: string,
            street: string
        }
    ) { }
}