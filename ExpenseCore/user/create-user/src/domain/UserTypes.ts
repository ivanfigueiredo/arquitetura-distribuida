export enum UserTypeEnum {
    individual = "INDIVIDUAL",
    business = "BUSINESS"
}

export const UserTypes: Record<string, string> = {
    Individual: UserTypeEnum.individual,
    Business: UserTypeEnum.business
}