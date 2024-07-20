import { ILogger } from "expense-core"
import { ICreateUser } from "../../src/application/ICreateUser"
import { IGenerateCodeConfirmation } from "../../src/application/IGenerateCodeConfirmationGateway"
import { IUserRepository } from "../../src/application/IUserRepository"
import { CreateUser } from "../../src/application/CreateUser"
import { User } from "../../src/domain/User"
import { InternalServerErrorException } from "../../src/application/exceptions/InternalServerErrorException"

describe('CreateUser', () => {
    let usecase: ICreateUser
    let repository: IUserRepository
    let generateCodeConfirmation: IGenerateCodeConfirmation
    let logger: ILogger

    beforeEach(() => {
        repository = {
            findUserByEmail: jest.fn(),
            findUserByUserId: jest.fn(),
            save: jest.fn()
        }
        generateCodeConfirmation = {
            generateCode: jest.fn()
        }
        logger = {
            error: jest.fn(),
            info: jest.fn()
        }
        usecase = new CreateUser(repository, generateCodeConfirmation, logger)
    })

    test('Deve ser definido', () => {
        expect(usecase).toBeDefined()
    })

    test('Deve criar um usuário com sucesso', async () => {
        const spyOnCreate = jest.spyOn(User, 'create')
        const spyOnGenerateCode = jest.spyOn(generateCodeConfirmation, 'generateCode')
        const spyOnSave = jest.spyOn(repository, 'save')

        const result = await usecase.execute({ email: 'mail@test.com', password: 'S&nh@123', userType: 'Individual' })

        expect(result).toHaveProperty('userId')
        expect(result.userId).toBeTruthy()
        expect(spyOnCreate).toHaveBeenCalled()
        expect(spyOnGenerateCode).toHaveBeenCalled()
        expect(spyOnSave).toHaveBeenCalled()
    })

    test('Deve lançar uma exceção caso a persistencia dê erro e não deve chamar o gateway do generate code', async () => {
        jest.spyOn(repository, 'save').mockImplementationOnce((): never => { throw new InternalServerErrorException("Internal server error. If the error persists, contact support", 500) })
        const spyOnCreate = jest.spyOn(User, 'create')
        const spyOnGenerateCode = jest.spyOn(generateCodeConfirmation, 'generateCode')
        const promise = usecase.execute({ email: 'mail@test.com', password: 'S&nh@123', userType: 'Individual' })

        await expect(promise).rejects.toThrow(
            new InternalServerErrorException("Internal server error. If the error persists, contact support", 500)
        )
        expect(spyOnCreate).toHaveBeenCalled()
        expect(spyOnGenerateCode).not.toHaveBeenCalled()
    })
})