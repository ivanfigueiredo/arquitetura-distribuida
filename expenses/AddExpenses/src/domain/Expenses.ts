import { randomUUID } from "crypto";
import { ExpenseOptions } from "./ExpensesEnum";

export class Expenses {
    [key: string]: any;

    private constructor(
        readonly id: string,
        readonly value: number,
        readonly category: string,
        readonly description: string,
        readonly dateOfPurchase: string
    ) {}

    public static create(value: number, category: string, description: string, dateOfPurchase: string): Expenses {
        const id = randomUUID();
        const expenseCategory = ExpenseOptions[category]
        return new Expenses(id, value, expenseCategory, description, dateOfPurchase)
    }

    public static restore(id: string, value: number, category: string, description: string, dateOfPurchase: string): Expenses {
        return new Expenses(id, value, category, description, dateOfPurchase)
    }
}