import { ILogger } from "expense-core"
import { IGenerateEmailConfirmationCode } from "../../src/application/IGenerateEmailConfirmationCode"
import { IAuthGateway } from "../../src/application/IAuthGateway"
import { ICodeRepository } from "../../src/application/ICodeRepository"
import { GenerateEmailConfirmationCode } from "../../src/application/GenerateEmailConfirmationCode"

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
})