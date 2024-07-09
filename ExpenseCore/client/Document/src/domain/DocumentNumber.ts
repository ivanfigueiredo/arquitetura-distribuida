import { DomainException } from "./exception/DomainException"

export class DocumentNumber {
    readonly value: string = ''

    constructor(document: string) {
        const documentClean = this.cleanDocument(document)
        if (this.isCPF(documentClean)) {
            const cpfDigit = 8
            this.isValid(documentClean, cpfDigit)
            this.value = documentClean
        } else if (this.isCNPJ(documentClean)) {
            const cnpjDigit = 11
            this.isValid(documentClean, cnpjDigit)
            this.value = documentClean
        } else {
            throw new DomainException('Invalid Document', 422)
        }
    }

    private isCPF(document: string): boolean {
        return document.length === 11
    }

    private isCNPJ(document: string): boolean {
        return document.length === 14
    }

    private cleanDocument(document: string): string {
        return document.replace(/[^0-9]/g, '')
    }

    private isValid(document: string, digit: number): void {
        let isValid = false
        const documentArray: string[] = document.split('')
        if (!this.digitsEqual(documentArray)) throw new DomainException('Invalid Document', 422)
        const CHECK_DIGIT = 2
        for (let i = 0; i < CHECK_DIGIT; i++) {
            isValid = this.interatorDigits(digit + i, documentArray.map(item => Number(item)))
            if (!isValid) throw new DomainException('Invalid Document', 422)
        }
        if (!isValid) throw new DomainException('Invalid Document', 422)
    }

    private digitsEqual(cpf: string[]): boolean {
        return (new Set(cpf).size > 1)
    }

    private cpfMultiplier(length: number): number[] {
        let multipliers: number[] = []
        let cpfMultiplier = 2
        for (let i = 0; i <= length; i++) {
            multipliers[i] = cpfMultiplier++
        }
        return multipliers
    }

    private cnpjMultiplier(length: number): number[] {
        const cnpjMultiplier = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        return cnpjMultiplier.reverse().splice(0, length + 1)
    }

    private getMultipliers(length: number, document: string): number[] {
        return this.isCPF(document) ? this.cpfMultiplier(length) : this.cnpjMultiplier(length)
    }

    private interatorDigits(digit: number, document: number[]): boolean {
        let soma = 0
        let multipliers = this.getMultipliers(digit, document.join(''))
        let j = 0
        for (let i = digit; i >= 0; i--) {
            soma += document[i] * multipliers[j]
            j++
        }
        return ((soma * 10) % 11) === document[digit + 1]
    }
}
