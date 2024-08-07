export enum ClientType {
    Business = "PJ",
    Individual = "PF"
}

export const ClientTypeEnum: Record<string, ClientType> = {
    Business: ClientType.Business,
    Individual: ClientType.Individual
}

export enum RestoreClientType {
    PF = 'Individual',
    PJ = 'Business'
}

export const RestoreClientTypeEnum: Record<string, RestoreClientType> = {
    PF: RestoreClientType.PF,
    PJ: RestoreClientType.PJ
}