import { ILogger, Queue } from "expense-core"
import { IUserInfo } from "../../src/application/IUserInfor"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserInfo } from "../../src/application/UserInfo"

describe('UserInfo', () => {
    let userInfo: IUserInfo
    let userRepository: IUserRepository
    let queue: Queue
    let logger: ILogger

    beforeEach(() => {
        userRepository = {
            findUserByEmail: jest.fn(),
            findUserByUserId: jest.fn(),
            save: jest.fn()
        }
        queue = {
            connect: jest.fn(),
            consume: jest.fn(),
            publish: jest.fn()
        }
        logger = {
            error: jest.fn(),
            info: jest.fn()
        }
        userInfo = new UserInfo(userRepository, queue, logger)
    })

    test('Deve estar definido', () => {
        expect(userInfo).toBeDefined()
    })
})