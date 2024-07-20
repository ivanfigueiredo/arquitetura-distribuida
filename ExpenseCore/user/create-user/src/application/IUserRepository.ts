import { User } from "../domain/User";

export interface IUserRepository {
    save(user: User): Promise<void>
    findUserByUserId(userId: string): Promise<User | undefined>
    findUserByEmail(email: string): Promise<User | undefined>
}