import { ILogger } from "expense-core"
import { IUnitOfWorkInfra } from "../../src/infra/IUnitOfWorkInfra"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserDatabase } from "../../src/infra/UserDatabase"

describe('UserDatabase', () => {
    let unitOfWork: IUnitOfWorkInfra
    let logger: ILogger
    let userDatabase: IUserRepository

    beforeEach(async () => {
        unitOfWork = {
            findOne: jest.fn(),
            transaction: jest.fn()
        }
        logger = {
            error: jest.fn(),
            info: jest.fn()
        }
        userDatabase = new UserDatabase(unitOfWork, logger)
    })

    test('Deve estar definido', () => {
        expect(userDatabase).toBeDefined()
    })
})