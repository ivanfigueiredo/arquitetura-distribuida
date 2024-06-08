import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

export class Code {
    private constructor(
        readonly id: string,
        readonly code: string,
        readonly emailVerify: string,
        readonly expirationTime: Date
    ) { }

    public static create(email: string): Code {
        const id = randomUUID()
        const code = randomUUID()
        const expirationCode = dayjs().add(24, 'hour').toDate()
        return new Code(id, code, email, expirationCode)
    }
}