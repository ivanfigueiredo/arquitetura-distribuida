export interface IValidationToken {
    execute(dto: {token: string}): Promise<string>
}