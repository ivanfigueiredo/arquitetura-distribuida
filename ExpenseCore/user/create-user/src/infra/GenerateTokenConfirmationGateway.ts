import axios from 'axios';
import { IGenerateTokenConfirmation } from "../application/IGenerateTokenConfirmationGateway";
import { ISpan } from 'expense-core';

export class GenerateTokenConfirmationGateway implements IGenerateTokenConfirmation {
    constructor(private readonly context: ISpan) { }

    async generateToken(email: string): Promise<void> {
        const url = 'http://auth:6000/generate-email-confirmation-token'
        const headers = this.context.getHeaders();
        await axios.post(url, { email }, { headers })
    }
}