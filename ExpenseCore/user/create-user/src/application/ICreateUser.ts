import { CreateUserDto } from "./dto/CreateUserDto";

export interface ICreateUser {
    execute(dto: CreateUserDto): Promise<UserCreatedDto>
}

export type UserCreatedDto = {
    userId: string
}