import { randomUUID } from "crypto";
import { ClientType, ClientTypeEnum, RestoreClientTypeEnum } from "./ClientType";
import { DomainException } from "./exception/DomainException";
import { Contact } from "./Contact";

export class Client {
    readonly clientType: string

    private constructor(
        readonly id: string,
        type: string,
        readonly email: string,
        readonly userId: string,
        readonly phoneNumber: string,
        readonly contact: Contact,
        readonly name?: string,
        readonly companyReason?: string,
        readonly fullName?: string,
        readonly birthDate?: string

    ) {
        this.isValidClientType(type)
        this.isValidNaturalPerson(type, name)
        this.existCompanyReasonToNaturalPerson(type, companyReason)
        this.isValidLegalPerson(type, companyReason)
        this.existNameToCompanyReason(type, name)
        this.clientType = ClientTypeEnum[type]
    }

    private isValidClientType(clientType: string): void {
        if (!(clientType in ClientType)) {
            throw new DomainException("The customer type entered is invalid.", 422)
        }
    }

    private isValidNaturalPerson(clientType: string, name?: string): void {
        if (ClientTypeEnum[clientType] === ClientType.Individual && !name) {
            throw new DomainException("Name field is mandatory for registering an individual.", 422)
        }
    }

    private existCompanyReasonToNaturalPerson(clientType: string, companyReason?: string): void {
        if (ClientTypeEnum[clientType] === ClientType.Individual && companyReason) {
            throw new DomainException("CompanyReason does not apply to an individual.", 422);
        }
    }

    private isValidLegalPerson(clientType: string, companyReason?: string): void {
        if (ClientTypeEnum[clientType] === ClientType.Business && !companyReason) {
            throw new DomainException("CompanyReason field is mandatory for registering a business", 422);
        }
    }

    private existNameToCompanyReason(clientType: string, name?: string): void {
        if (ClientTypeEnum[clientType] === ClientType.Business && name) {
            throw new DomainException("Name does not apply to a legal person", 422);
        }
    }

    public static create(
        clientType: string,
        email: string,
        userId: string,
        phoneNumber: string,
        contact: {
            name: string,
            email: string,
            phoneNumber: string,
            relationship: string
        },
        name?: string,
        companyReason?: string,
        fullName?: string,
        birthDate?: string
    ): Client {
        const clientId = randomUUID();
        const active = true;
        return new Client(
            clientId,
            clientType,
            email,
            userId,
            phoneNumber,
            Contact.create(
                clientId,
                contact.name,
                contact.email,
                contact.phoneNumber,
                contact.relationship
            ),
            name,
            companyReason,
            fullName,
            birthDate
        );
    }

    public static restore(
        clientId: string,
        clientType: string,
        email: string,
        userId: string,
        phoneNumber: string,
        contact: {
            clientId: string,
            name: string,
            email: string,
            phoneNumber: string,
            relationship: string
        },
        name?: string,
        companyReason?: string,
        fullName?: string,
        birthDate?: string
    ): Client {
        return new Client(
            clientId,
            RestoreClientTypeEnum[clientType],
            email,
            userId,
            phoneNumber,
            Contact.restore(
                contact.clientId,
                contact.name,
                contact.email,
                contact.phoneNumber,
                contact.relationship
            ),
            name,
            companyReason,
            fullName,
            birthDate
        );
    }
}