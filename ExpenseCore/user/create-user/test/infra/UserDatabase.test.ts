import { ILogger } from "expense-core"
import { UserDatabase } from "../../src/infra/UserDatabase"
import { User } from "../../src/domain/User"
import { InternalServerErrorException } from "../../src/application/exceptions/InternalServerErrorException"
import { UserEntity } from "../../src/infra/entities/UserEntity"
import { randomUUID } from "crypto"
import { DatabaseConnection } from "../../src/infra/DatabaseConnection"
import { Repository } from "typeorm"

describe('UserDatabase', () => {
    let connection: DatabaseConnection
    let logger: ILogger
    let userDatabase: UserDatabase
    let mockRepository: jest.Mocked<Repository<UserEntity>>;

    beforeEach(async () => {
        mockRepository = {
            save: jest.fn(),
            findOne: jest.fn()
        } as any
        connection = {
            init: jest.fn(),
            getDataSourcer: jest.fn().mockReturnValue({
                getRepository: jest.fn().mockReturnValue(mockRepository)
            })
        }
        logger = {
            error: jest.fn(),
            info: jest.fn()
        }
        userDatabase = new UserDatabase(connection, logger)
    })

    test('Deve estar definido', () => {
        expect(userDatabase).toBeDefined()
    })

    test('Deve salvar um usuário com sucesso', async () => {
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        const spyOnSave = jest.spyOn(mockRepository, 'save')
        await userDatabase.save(user)

        expect(spyOnSave).toHaveBeenCalledTimes(1)
    })

    test('Deve lançar uma exceção caso ocorra um erro', async () => {
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        const spyOnLogger = jest.spyOn(logger, 'error')
        jest.spyOn(mockRepository, 'save').mockImplementation((): never => { throw new Error() })
        const promise = userDatabase.save(user)
        await expect(promise).rejects.toThrow(
            new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        )
        expect(spyOnLogger).toHaveBeenCalledTimes(1)
    })

    test('Deve retornar um usuário pelo email', async () => {
        const spyOnFindOne = jest.spyOn(mockRepository, 'findOne')
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        jest.spyOn(mockRepository, 'findOne').mockResolvedValue(UserEntity.from(user))
        const output = await userDatabase.findUserByEmail('test@mail.com')
        expect(output).toBeInstanceOf(User)
        expect(output).not.toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar nulo caso não seja encontrado nenhum usuário com o e-maail informado', async () => {
        const spyOnFindOne = jest.spyOn(mockRepository, 'findOne')
        const output = await userDatabase.findUserByEmail('test@mail.com')
        expect(output).toBeUndefined()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar um usuário pelo userId', async () => {
        const spyOnFindOne = jest.spyOn(mockRepository, 'findOne')
        const userId = randomUUID()
        const user = User.create('test@mail.com', 'S&nh@123', 'Individual')
        jest.spyOn(mockRepository, 'findOne').mockResolvedValue(UserEntity.from(user))
        const output = await userDatabase.findUserByUserId(userId)
        expect(output).toBeInstanceOf(User)
        expect(output).not.toBeNull()
        expect(spyOnFindOne).toHaveBeenCalled()
    })

    test('Deve retornar nulo caso não seja encontrado nenhum usuário com o userId informado', async () => {
        const userId = randomUUID()
        const spyOnFindOne = jest.spyOn(mockRepository, 'findOne')
        const output = await userDatabase.findUserByUserId(userId)
        expect(output).toBeUndefined()
        expect(spyOnFindOne).toHaveBeenCalled()
    })
})