import { ILogger, Queue } from "expense-core"
import { IUserInfo } from "../../src/application/IUserInfor"
import { IUserRepository } from "../../src/application/IUserRepository"
import { UserInfo } from "../../src/application/UserInfo"
import { User } from "../../src/domain/User"

describe('UserInfo', () => {
    let usecase: IUserInfo
    let userRepository: IUserRepository
    let queue: Queue
    let logger: ILogger

    const userMock = User.create('test@mail.com', 'S&nh@123', 'Individual')

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
        usecase = new UserInfo(userRepository, queue, logger)
    })

    test('Deve estar definido', () => {
        expect(usecase).toBeDefined()
    })

    test('Deve retornar um usuário pelo email', async () => {
        jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(userMock)
        const spyOnFindUserByEmail = jest.spyOn(userRepository, 'findUserByEmail')
        const spyOnPublish = jest.spyOn(queue, 'publish')

        await usecase.execute({ email: 'test@mail.com' })

        expect(spyOnFindUserByEmail).toHaveBeenCalledTimes(1)
        expect(spyOnPublish).toHaveBeenCalledWith(
            'client.events',
            'client.registration.step-2',
            {
                userId: userMock.userId,
                email: userMock.email,
                password: userMock.password.value,
                userType: userMock.userType
            }
        )
    })

    test('Deve retornar um erro caso o usuário não exista com o email informado', async () => {
        jest.spyOn(userRepository, 'findUserByEmail').mockResolvedValue(undefined)
        const spyOnFindUserByEmail = jest.spyOn(userRepository, 'findUserByEmail')
        const spyOnPublish = jest.spyOn(queue, 'publish')

        await usecase.execute({ email: 'test@mail.com' })

        expect(spyOnFindUserByEmail).toHaveBeenCalledTimes(1)
        expect(spyOnPublish).toHaveBeenCalledWith(
            'user.events',
            'user.info.error',
            {
                error: {
                    message: 'User not found',
                    statusCode: 404
                }
            }
        )
    })
})