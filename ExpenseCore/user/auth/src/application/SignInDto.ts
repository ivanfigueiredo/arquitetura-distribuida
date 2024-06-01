export interface SignInDto {
    email: string;
    password: string;
}

export interface GenerateEmailConfirmationTokenDto extends SignInDto {
    email: string;
}