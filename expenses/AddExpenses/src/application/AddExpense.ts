import { IAddExpenses, Input } from "./IAddExpense";
import { ICommand } from "./ICommand";

export class AddExpenses implements IAddExpenses {
    constructor(private readonly command: ICommand) {}

    async execute(dto: Input): Promise<void> {
    
        await this.command.replyTo('Fila1', {});
    }
}