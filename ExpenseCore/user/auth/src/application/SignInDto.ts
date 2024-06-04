export interface SignInDto {
    email: string;
    password: string;
}

export interface GenerateEmailConfirmationTokenDto {
    email: string;
}