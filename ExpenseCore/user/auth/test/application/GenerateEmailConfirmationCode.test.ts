import { ILogger } from "expense-core"
import { IGenerateEmailConfirmationCode } from "../../src/application/IGenerateEmailConfirmationCode"
import { IAuthGateway } from "../../src/application/IAuthGateway"
import { ICodeRepository } from "../../src/application/ICodeRepository"
import { GenerateEmailConfirmationCode } from "../../src/application/GenerateEmailConfirmationCode"
import { Code } from "../../src/domain/Code"

describe('GenerateEmailConfirmationCode', () => {
    let usecase: IGenerateEmailConfirmationCode
    let codeRepository: ICodeRepository
    let authGateway: IAuthGateway
    let logger: ILogger

    beforeEach(() => {
        codeRepository = {
            save: jest.fn()
        }
        authGateway = {
            createUserNotification: jest.fn()
        }
        logger = {
            info: jest.fn(),
            error: jest.fn()
        }
        usecase = new GenerateEmailConfirmationCode(codeRepository, authGateway, logger)
    })

    test('Deve estar definido', () => {
        expect(usecase).toBeDefined()
    })

    test('Deve salvar o código gerado com sucesso', async () => {
        const email = 'test@mail.com'
        const spyOnCreate = jest.spyOn(Code, 'create')
        const spyOnSave = jest.spyOn(codeRepository, 'save')
        const spyOnCreateUserNotification = jest.spyOn(authGateway, 'createUserNotification')

        await usecase.execute({ email })

        expect(spyOnCreate).toHaveBeenCalledWith(email)
        expect(spyOnSave).toHaveBeenCalledTimes(1)
        expect(spyOnCreateUserNotification).toHaveBeenCalledTimes(1)
    })
})