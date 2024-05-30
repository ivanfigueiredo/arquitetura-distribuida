export interface IAddExpenses {
    execute(dto: Input): Promise<void>
}

export interface Input {
    value: number;
    category: string;
    description: string;
    dateOfPurchase: string;
}