import { randomUUID } from "crypto"
import { User } from "../../src/domain/User"
import { DomainException } from "../../src/domain/exception/DomainException"

describe('User', () => {
    test('Deve retornar um usuário com sucesso', () => {
        expect(User.restore(randomUUID(), 'test@mail.com', 'S&nh@123', 'Individual', true)).toBeInstanceOf(User)
    })

    test('Deve retornar um erro caso o email não esteja verificado', () => {
        expect(() => User.restore(randomUUID(), 'test@mail.com', 'S&nh@123', 'Individual', false)).toThrow(
            new DomainException("Email has not been verified.", 422)
        )
    })
})