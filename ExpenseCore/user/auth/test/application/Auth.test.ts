import { ILogger } from "expense-core"
import { IAuth } from "../../src/application/IAuth"
import { IUserRepository } from "../../src/application/IUserRepository"
import { Auth } from "../../src/application/Auth"
import { User } from "../../src/domain/User"
import { randomUUID } from "crypto"
import { JWT } from "../../src/application/JWT"
import { UnauthorizedException } from "../../src/infra/exceptions/UnauthorizedException"

describe('Auth', () => {
    let usecase: IAuth
    let userRepository: IUserRepository
    let logger: ILogger

    beforeEach(() => {
        userRepository = {
            findUserByEmail: jest.fn()
        }
        logger = {
            info: jest.fn(),
            error: jest.fn()
        }
        usecase = new Auth(userRepository, logger)
    })

    test('Deve estar definido', () => {
        expect(usecase).toBeDefined()
    })

    test('Deve retornar um token com sucesso', async () => {
        const userId = randomUUID()
        const user = User.restore(userId, 'test@mail.com', 'S&nh@123', 'Individual', true)
        jest.spyOn(user.password, 'passwordMatches').mockReturnValue(true)
        jest.spyOn(JWT, 'createToken').mockReturnValue('token')
        jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(user)
        const output = await usecase.execute({ email: 'test@mail.com', password: 'S&nh@123' })
        expect(output).toHaveProperty('token')
        expect(output.token).toBeTruthy()
    })
})