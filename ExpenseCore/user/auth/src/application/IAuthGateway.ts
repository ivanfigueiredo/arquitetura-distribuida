export interface IAuthGateway {
    createUserNotification(data: Data): Promise<void>;
}

export interface Data {
    email: string;
    code: string;
}