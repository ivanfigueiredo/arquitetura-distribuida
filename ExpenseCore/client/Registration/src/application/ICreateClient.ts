import { UserInfoDto } from "./dto/UserInfoDto";

export interface ICreateClient {
    execute(dto: UserInfoDto): Promise<void>
}