import { InternalServerErrorException } from "../infra/exceptions/InternalServerErrorException";
import { IConfirmationEmail } from "./IConfirmationEmail";
import { IUnitOfWorkApplication } from "./IUnitOfWorkApplication";
import { IUserRepository } from "./IUserRepository";
import { ConfirmationEmailDto } from "./dto/ConfirmationEmailDto";

export class ConfirmationEmail implements IConfirmationEmail {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly unitOfWork: IUnitOfWorkApplication
    ) { }

    async execute(dto: ConfirmationEmailDto): Promise<void> {
        try {
            await this.unitOfWork.startTransaction();
            const user = await this.userRepository.finUserByEmailAndCode(dto.email, dto.code);
            if (user) {
                user.confirmedEmail();
                await this.userRepository.save(user)
            }
            await this.unitOfWork.commit()
        } catch (error) {
            if (error instanceof InternalServerErrorException) {
                await this.unitOfWork.rollBack()
            }
            throw error;
        }
    }
}