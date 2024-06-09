import { ConfirmationEmailDto } from "./dto/ConfirmationEmailDto";

export interface IConfirmationEmail {
    execute(dto: ConfirmationEmailDto): Promise<void>
}