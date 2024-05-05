import { IUserDAO } from "./IUserDAO";
import { IUserService, Output } from "./IUserService";
import { JWT } from "./JWT";

export class UserService implements IUserService {
    constructor(private readonly userDAO: IUserDAO) {}

    async auth(dto: any): Promise<Output> {
        const user = await this.userDAO.findUserByEmail(dto.email);
        const token = JWT.createToken(user);

        return {token}
    }
}