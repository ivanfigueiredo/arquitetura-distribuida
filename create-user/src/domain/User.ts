import { randomUUID } from "crypto"

export class User {
    private constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly password: string,
        readonly birthdate: string,
    ) {}

    public static create(name: string, email: string, password: string, birthdate: string): User {
        const id = randomUUID();
        return new User(id, name, email, password, birthdate);
    }

    public static restore(id: string, name: string, email: string, password: string, birthdate: string): User {
        return new User(id, name, email, password, birthdate);
    }
}