import jwt from 'jsonwebtoken'
import { User } from '../domain/User';

export class JWT {

    public static createToken(user: User, expiresIn: string): string {
        const SECRET = process.env.SECRET_KEY as string;
        const KEY = process.env.KEY as string;
        const token = jwt.sign({ userId: user.userId }, SECRET, { expiresIn, algorithm: 'HS256', keyid: KEY })
        return token;
    }
}