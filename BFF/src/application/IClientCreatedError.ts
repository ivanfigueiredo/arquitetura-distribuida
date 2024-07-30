import { ClientCreatedErrorDto } from "./dto/ClientCreatedErrorDto";

export interface IClientCreatedError {
    execute(dto: ClientCreatedErrorDto): Promise<void>
}