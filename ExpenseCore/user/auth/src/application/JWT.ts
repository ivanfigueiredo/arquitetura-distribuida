import jwt from 'jsonwebtoken'
import { User } from '../domain/User';

export class JWT {

    public static createToken(expiresIn: string, user?: User): string {
        const SECRET = process.env.SECRET_KEY as string;
        const KEY = process.env.KEY as string;
        const token = jwt.sign(user ? { userId: user.userId } : {}, SECRET, { expiresIn, algorithm: 'HS256', keyid: KEY })
        return token;
    }

    public static validate(token: string) {
        const SECRET = process.env.SECRET_KEY as string
        const KEY = process.env.KEY as string
        return jwt.verify(token, SECRET, { algorithms: ['HS256'] }) as DecodedToken
    }
}

type DecodedToken = {
    userId: string;
    iat: number;
    exp: number;
}