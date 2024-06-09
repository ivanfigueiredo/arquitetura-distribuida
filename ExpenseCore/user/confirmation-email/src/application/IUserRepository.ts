import { User } from "../domain/User";

export interface IUserRepository {
    save(user: User): Promise<void>
    finUserByEmailAndCode(email: string, code: string): Promise<User | null>
}