export interface IUserDAO {
    findUserByEmail(email: string): Promise<any>
}