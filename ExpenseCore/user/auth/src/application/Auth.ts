import { ILogger } from 'expense-core';
import { IAuth, Output } from "./IAuth";
import { JWT } from "./JWT";
import { SignInDto } from "./SignInDto";
import { IUserRepository } from "./IUserRepository";
import { UnauthorizedException } from "../infra/exceptions/UnauthorizedException";

export class Auth implements IAuth {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly logger: ILogger
    ) { }

    async execute(dto: SignInDto): Promise<Output> {
        this.logger.info(`Auth - buscando usuario para o email: ${dto.email}`)
        const user = await this.userRepository.findUserByEmail(dto.email);
        if (!user.password.passwordMatches(dto.password)) {
            this.logger.error("Auth - Error: Email ou senha inválidos")
            throw new UnauthorizedException('Email or password invalid', 401);
        }
        const token = JWT.createToken('1h', user);
        this.logger.info("Auth - token gerado com sucesso");
        return { token }
    }
}