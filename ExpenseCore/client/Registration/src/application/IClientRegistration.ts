import { ClientDto } from "./dto/ClientDto";

export interface IClientRegistration {
    execute(dto: ClientDto): Promise<void>
}