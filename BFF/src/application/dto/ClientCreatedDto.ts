export interface ClientCreatedDto {
    eventName: string
    timestamp: string
    data?: {
        clientId: string,
        name: string | undefined,
        fullName: string | undefined,
        companyReason: string | undefined,
        phoneNumber: string,
        userId: string,
        birthDate: string | undefined,
        clientType: string,
        contact: {
            name: string,
            email: string,
            phoneNumber: string,
            relationship: string
        },
        document?: {
            documentId: string
            documentType: string
            documentNumber: string
        },
        address?: {
            addressId: string,
            state: string,
            city: string,
            country: string,
            postalCode: string,
            street: string
        }
    }
}