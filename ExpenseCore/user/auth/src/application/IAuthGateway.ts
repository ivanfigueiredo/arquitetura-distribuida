export interface IAuthGateway {
    createUserNotification(data: Data): Promise<void>;
}

export interface Data {
    email: string;
    token: string;
}