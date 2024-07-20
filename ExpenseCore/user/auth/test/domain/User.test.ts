import { randomUUID } from "crypto"
import { User } from "../../src/domain/User"

describe('User', () => {
    test('Deve retornar um usuário com sucesso', () => {
        expect(User.restore(randomUUID(), 'test@mail.com', 'S&nh@123', 'Individual', true)).toBeInstanceOf(User)
    })
})