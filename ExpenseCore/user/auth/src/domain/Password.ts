import { createHash } from 'crypto';
import { DomainException } from './exception/DomainException';
export class Password {
    private constructor(readonly value: string) { }

    private static isValid(value: string): boolean {
        const specialCharPattern = /.*[!@#\$%^&*(),.?\":{}|<>].*/;
        const upperCasePattern = /.*[A-Z].*/;
        const lowerCasePattern = /.*[a-z].*/;
        const digitPattern = /.*[0-9].*/;
        return value.length >= 6 &&
            specialCharPattern.test(value) &&
            upperCasePattern.test(value) &&
            lowerCasePattern.test(value) &&
            digitPattern.test(value)
    }

    public passwordMatches(password: string): boolean {
        const passwordHash = createHash("sha1").update(password).digest("hex");
        const result = this.value === passwordHash;
        return result
    }

    public static create(value: string): Password {
        if (!this.isValid(value)) {
            throw new DomainException(
                "A senha não é válida. Ela deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
                422
            );
        }
        const password = createHash("sha1").update(value).digest("hex");
        return new Password(password);
    }

    public static restore(password: string): Password {
        return new Password(password);
    }


}