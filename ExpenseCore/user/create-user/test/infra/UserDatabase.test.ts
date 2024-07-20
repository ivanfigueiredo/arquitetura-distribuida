import { ILogger } from "expense-core"
import { IUnitOfWorkInfra } from "../../src/infra/IUnitOfWorkInfra"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserDatabase } from "../../src/infra/UserDatabase"
import { User } from "../../src/domain/User"
import { InternalServerErrorException } from "../../src/application/exceptions/InternalServerErrorException"
import { UserEntity } from "../../src/infra/entities/UserEntity"

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

    test('Deve lançar uma exceção caso ocorra um erro', async () => {
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        const spyOnLogger = jest.spyOn(logger, 'error')
        jest.spyOn(unitOfWork, 'transaction').mockImplementation((): never => { throw new Error() })
        const promise = userDatabase.save(user)
        await expect(promise).rejects.toThrow(
            new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        )
        expect(spyOnLogger).toHaveBeenCalledTimes(1)
    })

    test('Deve retornar um usuário pelo email', async () => {
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        jest.spyOn(unitOfWork, 'findOne').mockResolvedValue(UserEntity.from(user))
        const output = await userDatabase.findUserByEmail('test@mail.com')
        expect(output).toBeInstanceOf(User)
        expect(output).not.toBeNull()
    })
})