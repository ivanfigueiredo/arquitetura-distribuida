import { Password } from "./Password"

export class User {
    private constructor(
        readonly userId: string,
        readonly email: string,
        readonly password: Password,
        readonly userType: string
    ) {}

    public static restore(userId: string, email: string, password: string, userType: string): User {
        return new User(userId, email, Password.restore(password), userType)
    }
}