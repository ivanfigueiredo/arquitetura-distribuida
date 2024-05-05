import { IUserRepository } from "../application/IUserRepository";
import { User } from "../domain/User";
import { DatabaseConnection } from "./DatabaseConnection";

export class AuthDatabase implements IUserRepository {
    constructor(private readonly connection: DatabaseConnection) {}

    async save(user: User): Promise<void> {
        const query = await this.connection.getCollection('users');
        await query.insertOne(user);
    }
}