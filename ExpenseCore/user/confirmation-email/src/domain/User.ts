import { Code } from "./Code";
import { Password } from "./Password";

export class User {
    private constructor(
        readonly userId: string,
        readonly email: string,
        readonly password: Password,
        private emailVerified: boolean,
        readonly userType: string,
        readonly codeVerification: Code
    ) { }

    public confirmedEmail(): void {
        this.emailVerified = true;
    }

    public get getEmailVerified(): boolean {
        return this.emailVerified;
    }

    public static restore(userId: string, email: string, emailVerified: boolean, password: string, userType: string, code: Code): User {
        return new User(userId, email, Password.restore(password), emailVerified, userType, code)
    }
}