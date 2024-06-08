
export interface IGenerateCodeConfirmation {
    generateCode(email: string): Promise<void>;
}