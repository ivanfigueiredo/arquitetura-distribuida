export class CreateUserDto {
    constructor(
        readonly name: string,
        readonly email: string,
        readonly password: string,
        readonly birthdate: string,
        readonly budget: BudgetDto
    ) {}
}

export class BudgetDto {
    constructor(
        readonly totalLimit: number,
        readonly startDate: string
    ) {}
}