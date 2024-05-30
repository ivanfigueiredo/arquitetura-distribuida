import { Password } from "./Password"
import { DomainException } from "./exception/DomainException"

export class User {
    private constructor(
        readonly userId: string,
        readonly email: string,
        readonly password: Password,
        readonly userType: string,
        readonly emailVerified: boolean
    ) {
        this.isEmailVerified(emailVerified)
    }

    public static restore(userId: string, email: string, password: string, userType: string, emailVerified: boolean): User {
        return new User(userId, email, Password.restore(password), userType, emailVerified)
    }

    private isEmailVerified(emailVerified: boolean): void {
        if (!emailVerified) throw new DomainException("Email has not been verified.", 422)
    }
}