import { User } from "../domain/User";

export interface IUserRepository {
    save(user: User): Promise<void>
    findUserByUserId(userId: string): Promise<User | null>
    findUserByEmail(email: string): Promise<User | null>
}