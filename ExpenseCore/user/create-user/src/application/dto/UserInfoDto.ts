export interface UserInfoDto {
    email?: string;
    userId?: string;
    replyTo?: {
        exchange: string
        routingKey: string
    }
}