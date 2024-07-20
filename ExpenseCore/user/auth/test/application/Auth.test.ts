import { ILogger } from "expense-core"
import { IAuth } from "../../src/application/IAuth"
import { IUserRepository } from "../../src/application/IUserRepository"
import { Auth } from "../../src/application/Auth"

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
})