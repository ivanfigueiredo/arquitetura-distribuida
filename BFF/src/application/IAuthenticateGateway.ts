export interface IAuthenticateGateway {
    validate(token: string): Promise<string>
}