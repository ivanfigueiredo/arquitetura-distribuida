import { ILogger } from "expense-core"
import { IUnitOfWorkInfra } from "../../src/infra/IUnitOfWorkInfra"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserDatabase } from "../../src/infra/UserDatabase"
import { User } from "../../src/domain/User"

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

    test('Deve salvar um usuário com sucesso', async () => {
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        const spyOnTransaction = jest.spyOn(unitOfWork, 'transaction')
        await userDatabase.save(user)

        expect(spyOnTransaction).toHaveBeenCalledTimes(1)
    })
})