import { ILogger, Queue } from 'expense-core';
import { IUserInfo } from "./IUserInfor";
import { IUserRepository } from "./IUserRepository";
import { UserInfoDto } from "./dto/UserInfoDto";

export class UserInfo implements IUserInfo {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly queue: Queue,
        private readonly logger: ILogger
    ) { }

    public async execute(dto: UserInfoDto): Promise<void> {
        this.logger.info(`UserInfo - Iniciando microsservico para buscar informacao do usuario`)
        if (dto.email) {
            this.logger.info(`UserInfo - Buscando informacao do usuario pelo E-mail`)
            const user = await this.userRepository.findUserByEmail(dto.email)
            if (!user) {
                this.logger.info(`UserInfo - Usuario nao encontrado. Publicando evento de erro`)
                await this.queue.publish('user.events', 'user.info.error', { error: { message: 'User not found', statusCode: 404 } })
                return;
            }
            this.logger.info(`UserInfo - Retornando informacao do usuario`)
            await this.queue.publish(
                'client.events',
                'client.registration.step-2',
                {
                    userId: user.userId,
                    email: user.email,
                    password: user.password.value,
                    userType: user.userType
                }
            )
        }

        if (dto.userId) {
            this.logger.info(`UserInfo - Buscando informacao do usuario pelo userId`)
            const user = await this.userRepository.findUserByUserId(dto.userId)
            if (!user) {
                this.logger.info(`UserInfo - Usuario nao encontrado. Publicando evento de erro`)
                await this.queue.publish('user.events', 'user.info.error', { error: { message: 'User not found', statusCode: 404 } })
                return;
            }
            this.logger.info(`UserInfo - Retornando informacao do usuario`)
            await this.queue.publish(
                'client.events',
                'client.registration.step-2',
                {
                    userId: user.userId,
                    email: user.email,
                    password: user.password.value,
                    userType: user.userType
                }
            )
        }
    }
}