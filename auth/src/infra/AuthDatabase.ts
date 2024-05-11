import { IUserDAO } from "../application/IUserDAO";
import { DatabaseConnection } from "./DatabaseConnection";
import {IGetTraceContext} from './TraceContext';

export class AuthDatabase implements IUserDAO {
    constructor(
        private readonly connection: DatabaseConnection,
        private readonly traceContext: IGetTraceContext
    ) {}

    async findUserByEmail(email: string): Promise<any> {
        try {
            const query = await this.connection.getCollection('users');
            const user = await query.findOne({email})
            if (!user) throw new Error("Email or password invalid")
            return user;
        } catch (error) {
            console.log('====================>>>>>> ERROR', error)
            throw error
        } finally {
            
        }
    }
}