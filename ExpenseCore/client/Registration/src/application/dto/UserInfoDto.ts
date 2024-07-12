export class UserInfoDto {
    constructor(
        readonly userId: string,
        readonly email: string,
        readonly password: string,
        readonly userType: string
    ) { }
}