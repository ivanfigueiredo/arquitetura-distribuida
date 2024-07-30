import { ClientCreatedDto } from "./dto/ClientCreatedDto";

export interface IClientCreated {
    execute(dto: ClientCreatedDto): Promise<void>
}