import { ILogger } from "expense-core"
import { IUnitOfWorkInfra } from "../../src/infra/IUnitOfWorkInfra"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserDatabase } from "../../src/infra/UserDatabase"
import { User } from "../../src/domain/User"
import { InternalServerErrorException } from "../../src/application/exceptions/InternalServerErrorException"
import { UserEntity } from "../../src/infra/entities/UserEntity"
import { randomUUID } from "crypto"

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
        const spyOnFindOne = jest.spyOn(unitOfWork, 'findOne')
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        jest.spyOn(unitOfWork, 'findOne').mockResolvedValue(UserEntity.from(user))
        const output = await userDatabase.findUserByEmail('test@mail.com')
        expect(output).toBeInstanceOf(User)
        expect(output).not.toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar nulo caso não seja encontrado nenhum usuário com o e-maail informado', async () => {
        const spyOnFindOne = jest.spyOn(unitOfWork, 'findOne')
        const output = await userDatabase.findUserByEmail('test@mail.com')
        expect(output).toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar um usuário pelo userId', async () => {
        const spyOnFindOne = jest.spyOn(unitOfWork, 'findOne')
        const userId = randomUUID()
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        jest.spyOn(unitOfWork, 'findOne').mockResolvedValue(UserEntity.from(user))
        const output = await userDatabase.findUserByUserId(userId)
        expect(output).toBeInstanceOf(User)
        expect(output).not.toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar nulo caso não seja encontrado nenhum usuário com o userId informado', async () => {
        const userId = randomUUID()
        const spyOnFindOne = jest.spyOn(unitOfWork, 'findOne')
        const output = await userDatabase.findUserByUserId(userId)
        expect(output).toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })
})