export class ClientIncludedDocumentDto {
    constructor(
        readonly document?: {
            id: string
            documentName: string
            documentNumber: string
        },
        readonly error?: {
            message: string
        }
    ) { }
}