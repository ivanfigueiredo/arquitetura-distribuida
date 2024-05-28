import { SignInDto } from "./SignInDto";

export interface IAuth {
    execute(dto: SignInDto): Promise<Output>
}

export type Output = {
    token: string;
}