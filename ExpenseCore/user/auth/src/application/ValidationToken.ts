import { UnauthorizedException } from "../infra/exceptions/UnauthorizedException";
import { IValidationToken } from "./IValidationToken";
import { JWT } from "./JWT";

export class ValidationToken implements IValidationToken {
    public async execute(dto: {token: string}): Promise<string> {
        try {
            const output = JWT.validate(dto.token)
            return output.userId
        } catch (error: any) {
            console.log('==============>>>>> ERROR', error)
            throw new UnauthorizedException('Invalid token', 401)
        }
    }
}