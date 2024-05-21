import jwt from 'jsonwebtoken'

export class JWT {

    public static createToken(data: any): string {
        const SECRET = "fb0557e8-a202-495c-9eda-94fa65c33070"
        const KEY = "a2f6f906-a3d6-4a4e-bcaf-25e133151600"
        const token = jwt.sign(data, SECRET, {expiresIn: '1h', algorithm: 'HS256', keyid: KEY})

        return token;
    }
}