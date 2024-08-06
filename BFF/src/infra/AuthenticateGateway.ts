import axios from 'axios'
import { IAuthenticateGateway } from "../application/IAuthenticateGateway";

export class AuthenticateGateway implements IAuthenticateGateway {
    public async validate(token: string): Promise<string> {
        try {
            const url = 'http://auth:6000/validation-token'
            const output = await axios.post(url, { token })
            return output.data
        } catch (error: any) {
            throw error
        }
    }
}