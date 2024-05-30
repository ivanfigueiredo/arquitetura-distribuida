enum ExpensesEnum {
    Alimentacao = "ALIMENTACAO",
    Transporte = "TRANSPORTE",
    Moradia = "MORADIA",
    Entretenimento = "ENTRETENIMENTO",
    Saude = "SAUDE"
}

export const ExpenseOptions: Record<string, ExpensesEnum> = {
    Saude: ExpensesEnum.Saude,
    Transporte: ExpensesEnum.Transporte,
    Moradia: ExpensesEnum.Moradia,
    Entretenimento: ExpensesEnum.Entretenimento,
    Alimentacao: ExpensesEnum.Alimentacao
}