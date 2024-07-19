import { randomUUID } from "crypto"
import { User } from "../../src/domain/User"

describe('User', () => {
    test('Deve criar um usuário com sucesso', () => {
        expect(User.create('test@mail.com', 'S&nh@123', 'Individual')).toBeInstanceOf(User)
    })

    test('Deve restaurar um usuário com sucesso', () => {
        expect(User.restore(randomUUID(), 'test@mail.com', 'S&nh@123', 'Individual')).toBeInstanceOf(User)
    })
})