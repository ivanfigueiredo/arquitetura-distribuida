import { Code } from "../../src/domain/Code"

describe('Code', () => {
    test('Deve devolver uma instância de Code', () => {
        expect(Code.create('test@mail.com')).toBeInstanceOf(Code)
    })
})