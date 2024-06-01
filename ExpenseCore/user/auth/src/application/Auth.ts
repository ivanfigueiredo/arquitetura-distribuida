import { IAuth, Output } from "./IAuth";
import { JWT } from "./JWT";
import { SignInDto } from "./SignInDto";
import { IUserRepository } from "./IUserRepository";
import { UnauthorizedException } from "../infra/exceptions/UnauthorizedException";

export class Auth implements IAuth {
    constructor(private readonly userRepository: IUserRepository) { }

    async execute(dto: SignInDto): Promise<Output> {
        const user = await this.userRepository.findUserByEmail(dto.email);
        if (!user.password.passwordMatches(dto.password)) {
            throw new UnauthorizedException('Email or password invalid', 401);
        }
        const token = JWT.createToken('1h', user);
        return { token }
    }
}