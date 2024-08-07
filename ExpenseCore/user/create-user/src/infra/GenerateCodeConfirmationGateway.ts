import axios from 'axios';
import { IGenerateCodeConfirmation } from "../application/IGenerateCodeConfirmationGateway";
import { ISpan } from 'expense-core';

export class GenerateCodeConfirmationGateway implements IGenerateCodeConfirmation {
    constructor(private readonly context: ISpan) { }

    async generateCode(email: string): Promise<void> {
        const url = 'http://auth:6000/generate-email-confirmation-code'
        this.context.startSpanWithContext("call.code.generation")
        const headers = this.context.contextPropagationWith()
        await axios.post(url, { email }, { headers })
        this.context.endSpanWithContext()
    }
}