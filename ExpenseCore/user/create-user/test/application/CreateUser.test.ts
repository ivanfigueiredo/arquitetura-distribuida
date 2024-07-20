import { ILogger } from "expense-core"
import { ICreateUser } from "../../src/application/ICreateUser"
import { IGenerateCodeConfirmation } from "../../src/application/IGenerateCodeConfirmationGateway"
import { IUserRepository } from "../../src/application/IUserRepository"
import { CreateUser } from "../../src/application/CreateUser"
import { IUnitOfWorkApplication } from "../../src/application/IUnitOfWorkApplication"

describe('CreateUser', () => {
    let usecase: ICreateUser
    let repository: IUserRepository
    let unitOfWork: IUnitOfWorkApplication
    let generateCodeConfirmation: IGenerateCodeConfirmation
    let logger: ILogger

    beforeEach(() => {
        repository = {
            findUserByEmail: jest.fn(),
            findUserByUserId: jest.fn(),
            save: jest.fn()
        }
        unitOfWork = {
            commit: jest.fn(),
            release: jest.fn(),
            rollBack: jest.fn(),
            startTransaction: jest.fn()
        }
        generateCodeConfirmation = {
            generateCode: jest.fn()
        }
        logger = {
            error: jest.fn(),
            info: jest.fn()
        }
        usecase = new CreateUser(repository, unitOfWork, generateCodeConfirmation, logger)
    })

    test('Deve ser definido', () => {
        expect(usecase).toBeDefined()
    })
})