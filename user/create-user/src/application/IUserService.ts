import { CreateUserDto } from "./dto/CreateUserDto";

export interface IUserService {
    createUser(dto: CreateUserDto): Promise<any>
}