import { User } from "../domain/User";

export interface IUserRepository {
    findUserByEmail(email: string): Promise<User>
}