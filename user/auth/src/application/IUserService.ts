export interface IUserService {
    auth(dto: any): Promise<Output>
}

export type Output = {
    token: string;
}