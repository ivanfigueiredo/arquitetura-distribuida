
export interface IGenerateTokenConfirmation {
    generateToken(email: string): Promise<void>;
}