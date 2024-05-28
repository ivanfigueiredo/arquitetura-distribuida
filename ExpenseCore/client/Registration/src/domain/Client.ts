import { randomUUID } from "crypto";
import { ClientType, ClientTypeEnum } from "./ClientType";
import { DomainException } from "./exception/DomainException";

export class Client {
    readonly clientType: string;
    readonly email: string;
    readonly userId: string;
    readonly name?: string;
    readonly companyReason?: string;

    private constructor(readonly clientId: string, clientType: string, email: string, userId: string, name?: string, companyReason?: string) {
        this.isValidClientType(clientType);
        this.isValidNaturalPerson(clientType, name);
        this.existCompanyReasonToNaturalPerson(clientType, companyReason);
        this.isValidLegalPerson(clientType, companyReason);
        this.existNameToCompanyReason(clientType, name);
        this.clientType = ClientTypeEnum[clientType];
        this.email = email;
        this.name = name;
        this.companyReason = companyReason;
        this.userId = userId;
    }

    private isValidClientType(clientType: string): void {
        if (!(clientType in ClientType)) {
            throw new DomainException("The customer type entered is invalid.", 422)
        }
    }

    private isValidNaturalPerson(clientType: string, name?: string): void {
        if (ClientTypeEnum[clientType] === ClientType.Individual && !name) {
            throw new DomainException("Name field is mandatory for registering an individual.", 422);
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

    public static create(clientType: string, email: string, userId: string, name?: string, companyReason?: string): Client {
        const clientId = randomUUID();
        return new Client(clientId, clientType, email, userId, name, companyReason);
    }
}