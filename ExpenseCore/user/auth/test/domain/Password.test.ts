import { Password } from "../../src/domain/Password";
import { DomainException } from "../../src/domain/exception/DomainException";

describe("Password", () => {
    test.each([
        ['123456'],
        ['senha123'],
        ['Senha123'],
        ['s&nh@123'],
        ['senha'],
        ['s&nh@']
    ])('Deve lançar uma exceção caso a senha não respeite o formato definido', (value) => {
        expect(() => Password.create(value)).toThrow(
            new DomainException(
                "A senha não é válida. Ela deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
                422
            )
        )
    })

    test('Deve criar uma senha com sucesso', () => {
        expect(() => Password.create('S&nh@123')).not.toThrow(
            new DomainException(
                "A senha não é válida. Ela deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
                422
            )
        )
    })

    test('Deve validar uma senha com sucesso', () => {
        const password = Password.create('S&nh@123')
        expect(password.passwordMatches('S&nh@123')).toBeTruthy()
    })
})