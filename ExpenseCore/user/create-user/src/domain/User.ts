import { randomUUID } from "crypto"
import { Password } from "./Password";
import { UserTypes } from "./UserTypes";

export class User {
    private constructor(
        readonly userId: string,
        readonly email: string,
        readonly password: Password,
        readonly userType: string
    ) {}

    public static create(email: string, password: string, userType: string): User {
        const id = randomUUID();
        return new User(id, email, Password.create(password), UserTypes[userType]);
    }
}