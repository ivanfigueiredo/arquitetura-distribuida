export enum ClientType {
    Business = "PJ",
    Individual = "PF"
}

export const ClientTypeEnum: Record<string, ClientType> = {
    Business: ClientType.Business,
    Individual: ClientType.Individual
}