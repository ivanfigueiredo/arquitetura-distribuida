import { IConfirmationEmail } from "./IConfirmationEmail";
import { IUserRepository } from "./IUserRepository";
import { ConfirmationEmailDto } from "./dto/ConfirmationEmailDto";

export class ConfirmationEmail implements IConfirmationEmail {
    constructor(
        private readonly userRepository: IUserRepository
    ) { }

    async execute(dto: ConfirmationEmailDto): Promise<void> {
        const user = await this.userRepository.finUserByEmailAndCode(dto.email, dto.code);
        if (user) {
            user.confirmedEmail();
            await this.userRepository.save(user)
        }
    }
}