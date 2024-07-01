import { UserInfoDto } from "./dto/UserInfoDto";

export interface IUserInfo {
    execute(dto: UserInfoDto): Promise<void>;
}