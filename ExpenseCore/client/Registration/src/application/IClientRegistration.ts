import { ClientRegistrationDto } from "./dto/ClientRegistrationDto";

export interface IClientRegistration {
    execute(dto: ClientRegistrationDto): Promise<void>
}